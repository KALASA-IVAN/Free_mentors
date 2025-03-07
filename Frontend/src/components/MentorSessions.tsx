import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../constants/SideBar';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from '@mui/material';

interface Mentee {
    id: number;
    mentee: {
        firstName: string;
        lastName: string;
        email: string;
    };
    date: string;
    topic: string;
    status: 'pending' | 'Accepted' | 'Rejected';
}

const token = localStorage.getItem("token");

const MentorSessions: React.FC = () => {
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'Accepted' | 'Rejected'>('all'); 

    // Fetch mentorship sessions from backend
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                        query {
                            getMentorMentorshipSessions {
                                id
                                mentee {
                                    firstName
                                    lastName
                                    email
                                }
                                topic
                                date
                                status
                            }
                        }
                    `
                }, {
                    headers: {
                        session: token,
                    }
                });
    
                setMentees(response.data?.data?.getMentorMentorshipSessions || []);
                console.log(response.data?.data?.getMentorMentorshipSessions);
            } catch (err) {
                setError("Failed to load mentorship sessions.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchSessions();
    }, []);
    
    const handleAccept = async (id: number) => {
        try {
            await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        manageMentorshipSession(sessionId: "${id}", action: "accept") {
                            message
                        }
                    }
                `
            }, {
                headers: {
                    session: token,
                }
            });

            setMentees(mentees.map(m => m.id === id ? { ...m, status: 'Accepted' } : m));
            alert("Session Accepted");
        } catch (err) {
            setError("Failed to update session status.");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        manageMentorshipSession(sessionId: "${id}", action: "reject") {
                            message
                        }
                    }
                `
            }, {
                headers: {
                    session: token,
                }
            });
            alert("Session Rejected");
            setMentees(mentees.map(m => m.id === id ? { ...m, status: 'Rejected' } : m));
        } catch (err) {
            setError("Failed to update session status.");
        }
    };

    const calculateDaysDifference = (sessionDate: string) => {
        const session = new Date(sessionDate.replace(" ", "T"))
        const today = new Date();
        const timeDifference = session.getTime() - today.getTime();
        const dayDifference = Math.floor(timeDifference / (1000 * 3600 * 24)); 
        console.log(dayDifference);
        if (dayDifference > 1) {
            return `${dayDifference} days from today`;
        } else if (dayDifference === 1) {
            return `1 day from today`;
        } else if (dayDifference < 0 && dayDifference > -2) {
            return `1 day ago`;
        } else if (dayDifference === -7) {
            return `1 week ago`;
        } else if (dayDifference < -7 && dayDifference >= -30) {
            const weeksAgo = Math.floor(Math.abs(dayDifference) / 7);
            return `${weeksAgo} weeks ago`;
        } else if (dayDifference === -30) {
            return `1 month ago`;
        } else if (dayDifference < -30 && dayDifference >= -365) {
            const monthsAgo = Math.floor(Math.abs(dayDifference) / 30);
            return `${monthsAgo} months ago`;
        } else if (dayDifference === -365) {
            return `1 year ago`;
        } else if (dayDifference < -365) {
            const yearsAgo = Math.floor(Math.abs(dayDifference) / 365);
            return `${yearsAgo} years ago`;
        } else {
            return 'Today';
        }
    };

    const filteredMentees = statusFilter === 'all' ? mentees : mentees.filter(mentee => mentee.status === statusFilter);

    return (
        <Box display="flex">
            <SideBar />
            <Box flexGrow={1} p={4}>
                <Typography variant="h5" mb={2}>Mentorship Sessions</Typography>

                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'Accepted' | 'Rejected')}
                            label="Filter by Status"
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="accepted">Accepted</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 4, maxHeight: '70vh', overflowY: 'auto' }}> {/* Make table scrollable */}
                        <Table>
                            
                            <TableHead sx={{ bgcolor: '#506FD6' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Mentee</TableCell>
                                    <TableCell sx={{ color: 'white' }}>When</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Topic</TableCell>
                                    <TableCell sx={{ color: 'white'}}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMentees.length > 0 ? (
                                    filteredMentees.map((mentee) => (
                                        <TableRow key={mentee.id}>
                                            <TableCell>{mentee.mentee.firstName} {mentee.mentee.lastName}</TableCell>
                                            <TableCell>{calculateDaysDifference(mentee.date)}</TableCell>
                                            <TableCell>{mentee.status}</TableCell>
                                            <TableCell>{mentee.topic}</TableCell>
                                            <TableCell>
                                                {mentee.status === "pending" && ( // Only show icons if status is pending
                                                    <>
                                                        <Tooltip title="Accept Session">
                                                            <IconButton
                                                                sx={{
                                                                    color: "green",
                                                                    mr: 2,
                                                                    "&:hover": { color: "darkgreen" }
                                                                }}
                                                                onClick={() => handleAccept(mentee.id)}
                                                            >
                                                                <CheckCircleIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Reject Session">
                                                            <IconButton
                                                                sx={{
                                                                    color: "red",
                                                                    "&:hover": { color: "darkred" }
                                                                }}
                                                                onClick={() => handleReject(mentee.id)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                                There is nothing to show yet.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default MentorSessions;