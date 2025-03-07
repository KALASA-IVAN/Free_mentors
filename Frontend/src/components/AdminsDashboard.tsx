import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AdminsSidebar from '../constants/AdminsSidebar';

const Dashboard: React.FC = () => {
    const [mentors, setMentors] = useState(0);
    const [mentees, setMentees] = useState(0);
    const [newUsers, setNewUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/graphql/', {
                query: `
                    query {
                        allUsers {
                            isMentor
                            isAdmin
                        }
                    }
                `
            });

            const users = response.data?.data?.allUsers || [];

            // Categorizing users based on roles
            const totalMentors = users.filter((user: any) => user.isMentor && !user.isAdmin).length;
            const totalMentees = users.filter((user: any) => !user.isMentor && !user.isAdmin).length;
            const totalAdmins = users.filter((user: any) => user.isAdmin).length;

            // Assuming "new users" means total users minus admins
            setMentors(totalMentors);
            setMentees(totalMentees);
            setNewUsers(users.length - totalAdmins);

            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load user data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const userStats = [
        { name: 'Mentors', value: mentors },
        { name: 'Mentees', value: mentees },
        { name: 'New Users', value: newUsers },
    ];

    return (
        <Box display="flex">
            <AdminsSidebar />
            <Box flex={1} p={4} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                {/* Welcome Message */}
                <Typography variant="h4" gutterBottom>Welcome, Admin!</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Here’s an overview of the platform activity.
                </Typography>

                {/* Loading State */}
                {loading ? (
                    <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <>
                        {/* Quick Stats */}
                        <Grid container spacing={3} mt={3}>
                            {[
                                { title: "Total Mentors", value: mentors },
                                { title: "Total Mentees", value: mentees },
                                { title: "New Users", value: newUsers },
                            ].map((stat, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card sx={{ backgroundColor: "white", textAlign: "center", p: 2 }}>
                                        <CardContent>
                                            <Typography variant="h6">{stat.title}</Typography>
                                            <Typography variant="h4" color="primary">{stat.value}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* User Growth Chart */}
                        <Box mt={4}>
                            <Typography variant="h5" gutterBottom>User Growth</Typography>
                            <Card sx={{ p: 3 }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={userStats}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#506FD6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;
