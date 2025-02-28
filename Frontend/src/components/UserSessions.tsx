import React from 'react';
import SideBar from '../constants/SideBar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Typography } from '@mui/material';

const sessions = [
    { id: 1, mentor: 'John Doe', when: '2023-10-01', status: 'Pending', details: 'Session details here' },
    // Add more session objects as needed
];

const UserSessions: React.FC = () => {
    return (
        <Box display="flex">
            <SideBar />
            <Box flexGrow={1} p={4}>
                <Box color="black" p={2}>
                    <Typography variant="h5">Mentorship Sessions</Typography>
                </Box>
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
                                    <TableCell>{session.when}</TableCell>
                                    <TableCell>{session.status}</TableCell>
                                    <TableCell>{session.details}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="warning" sx={{ mr: 2 }}>Edit</Button>
                                        <Button variant="contained" color="error">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default UserSessions;