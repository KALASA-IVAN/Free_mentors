import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Button, Avatar } from '@mui/material';
import { FaHome, FaChartBar, FaCalendarAlt, FaBell, FaUser, FaUsers, FaBan } from 'react-icons/fa';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const AdminsSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const dispatch = useDispatch();

    // Set activeIndex based on the current path
    const items = [
        { text: 'Overview', icon: <FaHome />, path: '/admin/dashboard' },
        // { text: 'Notifications', icon: <FaBell />, path: '/notifications' },
        { text: `Mentors' List`, icon: <FaUser />, path: '/mentors' },
        { text: 'Users', icon: <FaUsers />, path: '/admin/users' },
        // { text: 'Reported Users', icon: <FaBan />, path: '/admin/reported-users' },
    ];

    // Find the active index based on the current path
    const activeIndex = items.findIndex((item) => item.path === location.pathname);

    const firstName = localStorage.getItem('firstName'); 
    const getInitials = (name: string) => {
        const names = name.split(' ');
        const initials = names.map((n) => n[0]).join('');
        return initials.toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isMentor');
        localStorage.removeItem('isAdmin');
        
        // Dispatch the logout action to clear the Redux state
        dispatch(logout());

        // Navigate to the login page
        navigate('/login'); 
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                '& .MuiDrawer-paper': { 
                    width: '20%', 
                    boxSizing: 'border-box',
                    backgroundColor: '#506FD6',
                    color: 'white'
                } 
            }}
        >
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: 'black' }}>
                        {getInitials(firstName)}
                    </Avatar>
                    <Typography variant="h6" sx={{ mt: 1, color: 'white' }}>
                        {firstName}
                    </Typography>
                </Box>

                <List sx={{ flexGrow: 1, mt: '20%', ml: '12%' }}>
                    {items.map((item, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => navigate(item.path)} // Navigate on click
                            sx={{
                                color: 'white',
                                backgroundColor: activeIndex === index ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                                borderRadius: '4px',
                                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
                <Box sx={{ p: 1, mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        startIcon={<ExitToApp />}
                        sx={{ bgcolor: 'white', color: "#506FD6" }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AdminsSidebar;