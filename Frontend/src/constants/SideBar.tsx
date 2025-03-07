import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Button, Avatar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import InboxIcon from '@mui/icons-material/Inbox';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';  // Import the logout action from authSlice

const SideBar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const dispatch = useDispatch();  // Get the dispatch function

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isMentor');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('firstName');
        
        // Dispatch the logout action to clear the Redux state
        dispatch(logout());

        // Navigate to the login page
        navigate('/login'); 
    };

    const isMentor = localStorage.getItem('isMentor') === 'true';  // Check if user is a mentor
    const firstName = localStorage.getItem('firstName'); 
    const getInitials = (name: string) => {
        const names = name.split(' ');
        const initials = names.map((n) => n[0]).join('');
        return initials.toUpperCase();
    };

    const items = [
        { text: `Mentors' directory`, icon: <SupervisedUserCircleIcon />, path: '/mentors' },
        { 
            text: 'Requests', 
            icon: <QuestionAnswerIcon />, 
            path: isMentor ? '/mentees' : '/requests'  // Redirect based on role
        },
        // { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
        // { text: 'Messages', icon: <InboxIcon />, path: '/messages' },
    ];

    // Find the active index based on the current path
    const activeIndex = items.findIndex((item) => item.path === location.pathname);

    const drawerContent = (
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#506FD6', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: 'black' }}>
                    {getInitials(firstName)}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 1, color: 'white' }}> {/* Changed text color to white */}
                    {firstName}
                </Typography>
            </Box>
            <List sx={{ flexGrow: 1, mt: '40%', borderTopRightRadius: 2, ml: '12%' }}>
                {items.map((item, index) => (
                    <ListItemButton 
                        key={index} 
                        onClick={() => {
                            navigate(item.path);
                            setMobileOpen(false);
                        }}
                        sx={{ 
                            color: 'white', // Default text color
                            backgroundColor: activeIndex === index ? 'rgba(255, 255, 255, 0.3)' : 'transparent', // Highlight active item
                            borderRadius: '4px', // Rounded corners for active item
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' } // Hover effect
                        }}
                    >
                        <ListItemIcon sx={{ color: 'white' }}> {/* Default icon color */}
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
            <Box sx={{ p: 1, mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained"  
                    startIcon={<ExitToAppIcon />}
                    sx={{ bgcolor: 'white', color: "#506FD6" }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box>
            <IconButton 
                onClick={handleDrawerToggle} 
                sx={{ display: { xs: 'block', sm: 'none' }, position: 'absolute', top: 10, left: 10, zIndex: 1300 }}
            >
                <MenuIcon sx={{ color: 'black' }} />
            </IconButton>
            <Drawer 
                variant="permanent" 
                sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: '20%', boxSizing: 'border-box' } }}
                open
            >
                {drawerContent}
            </Drawer>
            <Drawer 
                variant="temporary" 
                open={mobileOpen} 
                onClose={handleDrawerToggle} 
                sx={{ '& .MuiDrawer-paper': { width: '60%' } }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default SideBar;