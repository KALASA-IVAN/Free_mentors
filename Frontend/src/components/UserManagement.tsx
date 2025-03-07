import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import AdminsSidebar from '../constants/AdminsSidebar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isMentor: boolean;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                    query: `
                         query {
                          allUsers {
                             firstName
                             lastName
                             email
                             isMentor
                             isAdmin
                             bio
                             occupation
                             expertise
                           }
                         }
                    `
                });
                console.log(response.data);
                const fetchedUsers = response.data?.data?.allUsers || [];
    
                // Update role assignment logic
                const updatedUsers = fetchedUsers.map((user: User) => ({
                    ...user,
                    role: user.isAdmin ? 'admin' : user.isMentor ? 'mentor' : 'mentee'
                }));
    
                setUsers(updatedUsers);
            } catch (err) {
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsers();
    }, []);
    

    const handleConfirmChangeToMentor = (email: string) => {
        setSelectedUserEmail(email);
        setConfirmOpen(true);
    };

    const handleChangeToMentor = async () => {
        if (!selectedUserEmail) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No authentication token found.");
                return;
            }
            await axios.post(
                'http://127.0.0.1:8000/graphql/',
                {
                    query: `
                        mutation {
                            changeUserToMentor(email: "${selectedUserEmail}") {
                                message
                            }
                        }
                    `
                },
                {
                    headers: { session: token }
                }
            );
            setUsers(users.map(user => user.email === selectedUserEmail ? { ...user, role: 'mentor' } : user));
        } catch (err) {
            setError("Failed to update user role.");
        } finally {
            setConfirmOpen(false);
            setSelectedUserEmail(null);
        }
    };

    return (
        <Box display="flex">
            <AdminsSidebar />
            <Box flexGrow={1} p={4}>
                <Typography variant="h5" mb={2}>User Management</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#506FD6' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Names</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Role</TableCell>
                                    <TableCell sx={{ color: 'white' }}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell sx={{color: user.role === 'admin' ? 'red' : user.role === 'mentor' ? 'blue' : 'green',fontWeight: 'bold'}}>{user.role}</TableCell>
                                        <TableCell>
                                            {user.role === 'mentee' ? (
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => handleConfirmChangeToMentor(user.email)}
                                                >
                                                    Make Mentor
                                                </Button>
                                            ) : (
                                                <Button color="secondary" variant="outlined" disabled>
                                                    Mentor
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                    <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                        <WarningAmberIcon color="warning" sx={{ fontSize: 50, mb: 2 }} />
                        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>Confirm Action</DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ textAlign: 'center', fontSize: 16 }}>
                                Are you sure you want to make this user a <strong>mentor</strong>?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
                            <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="secondary" sx={{ px: 3 }}>
                                Cancel
                            </Button>
                            <Button onClick={handleChangeToMentor} variant="contained" color="primary" sx={{ px: 3, ml: 2 }}>
                                Confirm
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>
            </Box>
        </Box>
    );
};

export default UserManagement;
