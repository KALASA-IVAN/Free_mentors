import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import SideBar from '../constants/SideBar';
import AdminsSidebar from '../constants/AdminsSidebar';

const Dashboard: React.FC = () => {
    return (
        <Box display="flex">
            <AdminsSidebar />
            <Box flex={1} p={4} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                {/* Welcome Banner */}
                <Typography variant="h4" gutterBottom>
                    Welcome, John Doe!
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Here’s what’s happening today.
                </Typography>

                {/* Quick Stats */}
                <Grid container spacing={3} mt={3}>
                    {[
                        { title: "Total Mentors", value: 120 },
                        { title: "Pending Requests", value: 5 },
                        { title: "New Notifications", value: 3 },
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{ backgroundColor: "white", textAlign: "center", p: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{stat.title}</Typography>
                                    <Typography variant="h4" color="primary">
                                        {stat.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Upcoming Sessions */}
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Upcoming Sessions
                    </Typography>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="body1">Mentor: Alice Johnson</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Date: March 5, 2025 | Time: 2:00 PM
                        </Typography>
                        <Button variant="contained" sx={{ mt: 2 }}>
                            View Details
                        </Button>
                    </Card>
                </Box>

                {/* Recent Notifications */}
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                        Recent Notifications
                    </Typography>
                    <Card sx={{ p: 2 }}>
                        <Typography variant="body1">New request from Michael Smith</Typography>
                        <Typography variant="body2" color="textSecondary">
                            10 minutes ago
                        </Typography>
                    </Card>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
