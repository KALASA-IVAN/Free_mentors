import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../constants/SideBar';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

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
const token = localStorage.getItem("token")
const MentorSessions: React.FC = () => {
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch mentorship sessions from backend
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                        query {
                            getPendingSessions {
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
                },{
                    headers: {
                        session: token,  
                    }
                });
                // console.log(response.data)
                setMentees(response.data?.data?.getPendingSessions || []);
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
            },{
                headers: {
                    session: token,  
                }
            });
            
            setMentees(mentees.map(m => m.id === id ? { ...m, status: 'Accepted' } : m));
            alert("Session Accepted")
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
            },{
                headers: {
                    session: token,  
                }
            });
            alert("Session Rejected")
            setMentees(mentees.map(m => m.id === id ? { ...m, status: 'Rejected' } : m));
        } catch (err) {
            setError("Failed to update session status.");
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
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#506FD6' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>#</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Mentee</TableCell>
                                    <TableCell sx={{ color: 'white' }}>When</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Topic</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mentees.map((mentee) => (
                                    <TableRow key={mentee.id}>
                                        <TableCell>{mentee.id}</TableCell>
                                        <TableCell>{mentee.mentee.firstName} {mentee.mentee.lastName}</TableCell>
                                        <TableCell>{mentee.date}</TableCell>
                                        <TableCell>{mentee.status}</TableCell>
                                        <TableCell>{mentee.topic}</TableCell>
                                        <TableCell>
                                            {mentee.status === "pending" && (
                                                <>
                                                    <IconButton sx={{ color: "green", mr: 2 }} onClick={() => handleAccept(mentee.id)}>
                                                        <CheckCircleIcon />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => handleReject(mentee.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default MentorSessions;
