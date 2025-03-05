import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../constants/SideBar';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Session {
    id: number;
    mentor: string;
    sessionDate: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    details: string;
}
const token = localStorage.getItem("token")
const UserSessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user mentorship sessions from backend
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                        query {
                            userSessions {
                                id
                                mentor
                                sessionDate
                                status
                                details
                            }
                        }
                    `
                },{
                    headers: {
                        session: token,  
                    }
                });
                setSessions(response.data?.data?.userSessions || []);
            } catch (err) {
                setError("Failed to load mentorship sessions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    // Handle Delete Session
    const handleDelete = async (id: number) => {
        try {
            await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        deleteSession(id: ${id}) {
                            success
                        }
                    }
                `
            },{
                headers: {
                    session: token,  
                }
            });
            setSessions(sessions.filter(s => s.id !== id));
        } catch (err) {
            setError("Failed to delete session.");
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
                                    <TableCell sx={{ color: 'white' }}>Mentor</TableCell>
                                    <TableCell sx={{ color: 'white' }}>When</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Details</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sessions.map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell>{session.id}</TableCell>
                                        <TableCell>{session.mentor}</TableCell>
                                        <TableCell>{session.sessionDate}</TableCell>
                                        <TableCell>{session.status}</TableCell>
                                        <TableCell>{session.details}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" sx={{ mr: 2 }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(session.id)}>
                                                <DeleteIcon />
                                            </IconButton>
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

export default UserSessions;
