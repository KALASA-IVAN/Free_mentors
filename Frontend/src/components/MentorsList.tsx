import React, { useEffect, useState } from 'react';
import { Box, Avatar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Stack, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import SideBar from '../constants/SideBar';
import AdminSideBar from '../constants/AdminsSidebar';

interface Mentor {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    bio: string;
    occupation: string;
    expertise: string;
    profilePicture: string;
}

interface BookingDetails {
    date: string;
    time: string;
    reason: string;
    duration: number;
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

    // Check if user has a token
    const token = localStorage.getItem('token'); // Or use your preferred token storage method

    // Fetch mentors if the user is logged in and has a valid token
    useEffect(() => {
        if (!token) {
            setError("You need to be logged in to view mentors.");
            setLoading(false);
            return;
        }

        const fetchMentors = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                        query {
                            getAllMentors {
                                firstName
                                lastName
                                email
                                address
                                bio
                                occupation
                                expertise
                            }
                        }
                    `
                },{
                    headers: {
                        session: token,  
                    }
                });
                console.log(response)
                setMentors(response.data?.data?.getAllMentors || []);
            } catch (err) {
                setError("Failed to load mentors.");
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
    }, [token]);

    const handleOpenModal = (mentor: Mentor) => {
        // Fetch mentor details when a mentor is clicked
        const fetchMentorDetails = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                        query {
                            getMentor(email: "${mentor.email}") {
                                firstName
                                lastName
                                email
                                bio
                                occupation
                                expertise
                            }
                        }
                    `
                },{
                    headers: {
                        session: token,  
                    }
                });
                setSelectedMentor(response.data?.data?.getMentor || null);
            } catch (err) {
                setError("Failed to load mentor details.");
            }
        };

        fetchMentorDetails();
    };

    const handleCloseModal = () => {
        setSelectedMentor(null);
    };

    const handleOpenBooking = () => {
        setBookingOpen(true);
    };

    const handleCloseBooking = () => {
        setBookingOpen(false);
    };

    const handleBookingChange = (field: keyof BookingDetails, value: any) => {
        setBookingDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const handleSubmitBooking = async () => {
        if (!selectedMentor) return;
    
        const { email } = selectedMentor; // Extract mentor email
        const { date, time, reason, duration } = bookingDetails; // Extract session details
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        requestMentorshipSession(mentorEmail: "${email}", topic: "${reason}") {
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
            },{
                headers: {
                    session: token,  
                }
            });
    
            // Handle the response from the backend
            console.log("Mentorship Session Response:", response.data);
    
            // Reset the booking form and close the modals
            handleCloseBooking();
            handleCloseModal();
            setBookingDetails({
                date: '',
                time: '',
                reason: '',
                duration: 30
            });
    
            alert("Session booked successfully!");
        } catch (err) {
            console.error("Error submitting booking:", err);
            setError("Failed to book the session.");
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
                    <CircularProgress />
                ) : (
                    <Stack direction="row" spacing={4} flexWrap="wrap" justifyContent="center">
                        {mentors.map((mentor) => (
                            <Box
                                key={mentor.id}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleOpenModal(mentor)}
                            >
                                <Avatar src={mentor.profilePicture} sx={{ width: 64, height: 64 }} />
                                <Typography>{`${mentor.firstName} ${mentor.lastName}`}</Typography>
                            </Box>
                        ))}
                    </Stack>
                )}

            </Box>

            <Dialog open={!!selectedMentor} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogContent>
                    {selectedMentor && (
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar src={selectedMentor.profilePicture} sx={{ width: 80, height: 80, mb: 2 }} />
                            <Typography variant="h6">{`${selectedMentor.firstName} ${selectedMentor.lastName}`}</Typography>
                            <Typography variant="body2" color="textSecondary">{selectedMentor.email}</Typography>
                            <Typography variant="body2"><strong>Occupation:</strong> {selectedMentor.occupation}</Typography>
                            <Typography variant="body2"><strong>Expertise:</strong> {selectedMentor.expertise}</Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>{selectedMentor.bio}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between", mb: 2 }}>
                    <Button variant="outlined" color="primary" onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleOpenBooking}>Book Session</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={bookingOpen} onClose={handleCloseBooking} fullWidth maxWidth="sm">
                <DialogTitle>Book a Session</DialogTitle>
                <DialogContent>
                    {selectedMentor && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Schedule a session with {selectedMentor.firstName} {selectedMentor.lastName}
                            </Typography>

                            <Stack spacing={3} sx={{ mt: 2 }}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    value={bookingDetails.date}
                                    onChange={(e) => handleBookingChange('date', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />

                                <TextField
                                    label="Time"
                                    type="time"
                                    value={bookingDetails.time}
                                    onChange={(e) => handleBookingChange('time', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />

                                <FormControl fullWidth>
                                    <InputLabel id="duration-label">Session Duration</InputLabel>
                                    <Select
                                        labelId="duration-label"
                                        value={bookingDetails.duration}
                                        label="Session Duration"
                                        onChange={(e) => handleBookingChange('duration', e.target.value)}
                                    >
                                        <MenuItem value={15}>15 minutes</MenuItem>
                                        <MenuItem value={30}>30 minutes</MenuItem>
                                        <MenuItem value={45}>45 minutes</MenuItem>
                                        <MenuItem value={60}>60 minutes</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Reason for Session"
                                    multiline
                                    rows={4}
                                    value={bookingDetails.reason}
                                    onChange={(e) => handleBookingChange('reason', e.target.value)}
                                    fullWidth
                                    placeholder="Briefly describe what you'd like to discuss in this session..."
                                />
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBooking} variant="outlined">Cancel</Button>
                    <Button
                        onClick={handleSubmitBooking}
                        variant="contained"
                        color="primary"
                        disabled={!bookingDetails.date || !bookingDetails.time || !bookingDetails.reason}
                    >
                        Confirm Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MentorsList;
