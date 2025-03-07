import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../constants/SideBar';
import {
    IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography,
    CircularProgress, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Rating
} from '@mui/material';

interface Session {
    id: number;
    mentor: {
        firstName: string;
        email: string;
    };
    status: 'Pending' | 'Accepted' | 'Rejected';
    topic: string;
}

const token = localStorage.getItem("token");

const UserSessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [rating, setRating] = useState<number | null>(3);
    const [comment, setComment] = useState<string>("");
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                        query {
                            getUserMentorshipSessions {
                                id
                                topic
                                mentor {
                                    firstName
                                    email
                                }
                                status
                            }
                        }
                    `
                }, {
                    headers: {
                        session: token,
                    }
                });
                setSessions(response.data?.data?.getUserMentorshipSessions || []);
                console.log(response.data?.data?.getUserMentorshipSessions);
            } catch (err) {
                setError("Failed to load mentorship sessions.");
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const handleOpenDialog = (id: number) => {
        setSelectedSessionId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSessionId(null);
        setRating(3);
        setComment("");
    };

    const handleSubmitReview = async () => {
        if (!selectedSessionId || !rating || !comment) return;
        try {
            await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        addReview(sessionId: "${selectedSessionId}", rating: ${rating}, comment: "${comment}") {
                            message
                        }
                    }
                `
            }, {
                headers: { session: token }
            });
            handleCloseDialog();
            alert("Review submitted successfully.");
        } catch (err) {
            setError("Failed to submit review.");
        }
    };

    return (
        <Box display="flex">
            <SideBar />
            <Box flexGrow={1} p={4}>
                <Typography variant="h5" mb={2}>Mentorship Sessions</Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {loading ? (
                    <CircularProgress />
                ) : sessions.length === 0 ? (
                    <Typography variant="body1" sx={{ fontStyle: 'italic', mt: 4 }}>
                        No mentorship sessions found.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#506FD6' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Mentor</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Topic</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell>{session.mentor.firstName}</TableCell>
                                        <TableCell>{session.mentor.email}</TableCell>
                                        <TableCell>{session.status}</TableCell>
                                        <TableCell>{session.topic}</TableCell>
                                        <TableCell>
                                            {session.status === 'Accepted' && (
                                                <Button variant="contained" color="primary" onClick={() => handleOpenDialog(session.id)}>
                                                    Leave a Review
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Review Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Leave a Review</DialogTitle>
                    <DialogContent>
                        <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            margin="dense"
                            label="Your Review"
                            variant="outlined"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                        <Button onClick={handleSubmitReview} color="primary" variant="contained">Submit</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default UserSessions;