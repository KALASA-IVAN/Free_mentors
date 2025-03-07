import React, { useEffect, useState } from 'react';
import {
    Box, Avatar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, FormControl, InputLabel, Select, MenuItem, Stack, CircularProgress, Alert,
    Card, CardContent, CardActions, Chip, Grid, Rating
} from '@mui/material';
import axios from 'axios';
import SideBar from '../constants/SideBar';
import AdminSideBar from '../constants/AdminsSidebar';

interface Mentor {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    occupation: string;
    expertise: string;
}

interface BookingDetails {
    date: string;
    time: string;
    reason: string;
    duration: number;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    mentee: {
        firstName: string;
        lastName: string;
    };
}

const MentorsList: React.FC = () => {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [bookingOpen, setBookingOpen] = useState<boolean>(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
        date: '',
        time: '',
        reason: '',
        duration: 30
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsOpen, setReviewsOpen] = useState<boolean>(false);
    const [averageRatings, setAverageRatings] = useState<{ [key: string]: number }>({});
    const [hideReviewDialogOpen, setHideReviewDialogOpen] = useState<boolean>(false);
    const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        if (!token) {
            setError("You need to be logged in to view mentors.");
            setLoading(false);
            return;
        }

        const fetchMentorsAndAverageRatings = async () => {
            try {
                const mentorsResponse = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                        query {
                            getAllMentors {
                                firstName
                                lastName
                                email
                                bio
                                occupation
                                expertise
                            }
                        }
                    `
                }, { headers: { session: token } });

                const mentorsData = mentorsResponse.data?.data?.getAllMentors || [];
                setMentors(mentorsData);

                const ratingsData: { [key: string]: number } = {};
                for (const mentor of mentorsData) {
                    const reviewsResponse = await axios.post('http://127.0.0.1:8000/graphql/', {
                        query: `
                            query {
                                getReviewsForMentor(mentorEmail: "${mentor.email}") {
                                    rating
                                }
                            }
                        `
                    }, { headers: { session: token } });

                    const mentorReviews = reviewsResponse.data?.data?.getReviewsForMentor || [];
                    if (mentorReviews.length > 0) {
                        const totalRating = mentorReviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
                        ratingsData[mentor.email] = totalRating / mentorReviews.length;
                    } else {
                        ratingsData[mentor.email] = 0;
                    }
                }

                setAverageRatings(ratingsData);
            } catch (err) {
                setError("Failed to load mentors or average ratings.");
            } finally {
                setLoading(false);
            }
        };

        fetchMentorsAndAverageRatings();
    }, [token]);

    const handleOpenBooking = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setBookingOpen(true);
    };

    const handleCloseBooking = () => {
        setBookingOpen(false);
        setSelectedMentor(null);
        setBookingDetails({ date: '', time: '', reason: '', duration: 30 });
    };

    const handleBookingChange = (field: keyof BookingDetails, value: any) => {
        setBookingDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitBooking = async () => {
        if (!selectedMentor) return;
        try {
            const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        requestMentorshipSession(mentorEmail: "${selectedMentor.email}", topic: "${bookingDetails.reason}") {
                            mentorshipSession {
                                id
                                topic
                                date
                                status
                            }
                            message
                        }
                    }
                `
            }, { headers: { session: token } });

            console.log("Mentorship Session Response:", response.data);
            handleCloseBooking();
            alert("Session booked successfully!");
        } catch (err) {
            console.error("Error submitting booking:", err);
            setError("Failed to book the session.");
        }
    };

    const fetchReviews = async (mentorEmail: string) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    query {
                        getReviewsForMentor(mentorEmail: "${mentorEmail}") {
                            id
                            rating
                            comment
                            mentee {
                                firstName
                                lastName
                            }
                        }
                    }
                `
            }, { headers: { session: token } });
            console.log(mentorEmail)
            const reviews = response.data?.data?.getReviewsForMentor || [];
            setReviews(reviews);
            setReviewsOpen(true);
            console.log(response.data.data)
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to fetch reviews.");
        }
    };

    const handleCloseReviews = () => {
        setReviewsOpen(false);
        setReviews([]);
    };

    const handleOpenHideReviewDialog = (reviewId: string) => {
        setSelectedReviewId(reviewId);
        setHideReviewDialogOpen(true);
    };

    const handleCloseHideReviewDialog = () => {
        setHideReviewDialogOpen(false);
        setSelectedReviewId(null);
    };

    const handleHideReview = async () => {
        if (!selectedReviewId) return;
        try {
            const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        hideReview(reviewId: "${selectedReviewId}") {
                            message
                        }
                    }
                `
            }, { headers: { session: token } });

            console.log("Hide Review Response:", response.data);
            handleCloseHideReviewDialog();
            alert("Review hidden successfully!");
            // Optionally, refetch reviews to update the list
            if (selectedMentor) {
                fetchReviews(selectedMentor.email);
            }
        } catch (err) {
            console.error("Error hiding review:", err);
            setError("Failed to hide the review.");
        }
    };

    return (
        <Box display="flex">
            {isAdmin ? <AdminSideBar /> : <SideBar />}
            <Box flex={1} p={4}>
                <Typography variant="h4" align="center" gutterBottom>
                    Mentors
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={4} justifyContent="left" marginTop={2} width="100%">
                        {mentors.map((mentor) => (
                            <Grid item key={mentor.email} xs={12} sm={6} md={6} lg={6}>
                                <Card
                                    sx={{
                                        height: '100%', display: 'flex', flexDirection: 'column',
                                        borderRadius: 3, boxShadow: 3, transition: '0.3s',
                                        '&:hover': { boxShadow: 6 }
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', boxShadow: 2 }}>
                                                {mentor.firstName[0]}{mentor.lastName[0]}
                                            </Avatar>
                                            <Chip
                                                label={mentor.expertise}
                                                color="secondary"
                                                sx={{ fontSize: 12, px: 1.5 }}
                                            />
                                        </Box>
                                        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                                            {`${mentor.firstName} ${mentor.lastName}`}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {mentor.occupation}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 2, fontSize: '0.95rem' }}>
                                            {mentor.bio}
                                        </Typography>

                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="textSecondary">
                                                Average Rating:
                                            </Typography>
                                            <Rating
                                                value={averageRatings[mentor.email] || 0}
                                                readOnly
                                                precision={0.5}
                                                sx={{ color: '#1976d2' }}
                                            />
                                        </Box>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center', mt: 'auto', pb: 2 }}>
                                        <Button
                                            size="small"
                                            color="primary"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' },
                                                borderRadius: 2, textTransform: 'none',
                                                fontWeight: 'bold', px: 3, py: 1, mr: 2
                                            }}
                                            onClick={() => handleOpenBooking(mentor)}
                                        >
                                            Book Session
                                        </Button>
                                        <Button
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 2, textTransform: 'none',
                                                fontWeight: 'bold', px: 3, py: 1
                                            }}
                                            onClick={() => fetchReviews(mentor.email)}
                                        >
                                            View Reviews
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <Dialog open={bookingOpen} onClose={handleCloseBooking} fullWidth maxWidth="sm">
                <DialogTitle>Book a Session</DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    {selectedMentor && (
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Schedule a session with {selectedMentor.firstName} {selectedMentor.lastName}
                            </Typography>
                            <Stack spacing={3} sx={{ mt: 2 }}>
                                <TextField label="Reason for Session" multiline rows={4} value={bookingDetails.reason}
                                    onChange={(e) => handleBookingChange('reason', e.target.value)}
                                    fullWidth placeholder="Briefly describe what you'd like to discuss..."
                                />
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBooking} variant="outlined">Cancel</Button>
                    <Button onClick={handleSubmitBooking} variant="contained" color="primary"
                        disabled={!bookingDetails.reason}>
                        Confirm Booking
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={reviewsOpen} onClose={handleCloseReviews} fullWidth maxWidth="sm">
                <DialogTitle>Reviews</DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Box key={review.id} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {review.mentee.firstName} {review.mentee.lastName}
                                </Typography>
                                <Rating value={review.rating} readOnly precision={0.5} sx={{ color: '#1976d2' }} />
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {review.comment}
                                </Typography>
                                {isAdmin && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ mt: 1 }}
                                        onClick={() => handleOpenHideReviewDialog(review.id)}
                                    >
                                        Hide Review
                                    </Button>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                            No reviews available for this mentor.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviews} variant="outlined">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={hideReviewDialogOpen} onClose={handleCloseHideReviewDialog} fullWidth maxWidth="sm">
                <DialogTitle>Hide Review</DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Typography variant="body1">
                        Are you sure you want to hide this review?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHideReviewDialog} variant="outlined">Cancel</Button>
                    <Button onClick={handleHideReview} variant="contained" color="error">
                        Hide
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MentorsList;