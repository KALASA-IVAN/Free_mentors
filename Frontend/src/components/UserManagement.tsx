import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../constants/SideBar';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminsSidebar from '../constants/AdminsSidebar';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string; // 'user' or 'mentor'
    isMentor: boolean; // Boolean field to determine if a user is a mentor
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch users from backend
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
                             bio
                             occupation
                             expertise
                           }
                         }
                    `
                });
                console.log(response)
                const fetchedUsers = response.data?.data?.allUsers || [];
                
                const updatedUsers = fetchedUsers.map((user: User) => ({
                    ...user,
                    role: user.isMentor ? 'mentor' : 'mentee'
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

    // Handle Change to Mentor
    const handleChangeToMentor = async (email: string) => {
        try {
            const token = localStorage.getItem("token");
            console.log("Retrieved Token:", token);
            
            if (!token) {
                setError("No authentication token found.");
                return;
            }
            const response = await axios.post(
                'http://127.0.0.1:8000/graphql/',
                {
                    query: `
                        mutation {
                            changeUserToMentor(email: "${email}") {
                                message
                            }
                        }
                    `
                },
                {
                    headers: {
                        session: token,  
                    }
                }
            );
            
    
            console.log("Mentor Change Response:", response.data);
    
            setUsers(users.map(user => 
                user.email === email ? { ...user, role: 'mentor' } : user
            ));
        } catch (err) {
            console.error("Error changing user to mentor:", err);
            setError("Failed to update user role.");
        }
    };
    
    
    
    

    // Handle Delete User
    const handleDelete = async (id: number) => {
        try {
            await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    mutation {
                        deleteUser(id: ${id}) {
                            success
                        }
                    }
                `
            });
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            setError("Failed to delete user.");
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
                                    <TableCell sx={{ color: 'white' }}>#</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Names</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Email</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Role</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.firstName} {user.lastName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            {user.role === 'mentee' ? (
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => handleChangeToMentor(user.email)}
                                                >
                                                    Make Mentor
                                                </Button>
                                            ) : (
                                                <Button
                                                    color="secondary"
                                                    variant="outlined"
                                                    disabled
                                                >
                                                    Mentor
                                                </Button>
                                            )}
                                            <IconButton color="error" onClick={() => handleDelete(user.id)} sx={{ ml: 2 }}>
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

export default UserManagement;
