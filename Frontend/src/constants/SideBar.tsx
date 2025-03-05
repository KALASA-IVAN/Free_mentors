import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Button, Avatar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/Inbox';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';  // Import the logout action from authSlice

const SideBar: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();  // Get the dispatch function

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
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

    const isMentor = localStorage.getItem('isMentor') === 'true';  // Check if user is a mentor

    const items = [
        { text: `Mentors' directory`, icon: <SupervisedUserCircleIcon />, path: '/mentors' },
        { 
            text: 'Requests', 
            icon: <QuestionAnswerIcon />, 
            path: isMentor ? '/mentees' : '/requests'  // Redirect based on role
        },
        { text: 'Notifications', icon: <NotificationsIcon /> },
        { text: 'Messages', icon: <InboxIcon /> },
    ];
    

    const drawerContent = (
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#506FD6', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: 'black' }} />
                <Typography variant="h6" sx={{ mt: 1, color: 'black' }}>
                    John Doe
                </Typography>
            </Box>
            <List sx={{ flexGrow: 1, mt: '40%', borderTopRightRadius: 2, ml: '12%' }}>
                {items.map((item, index) => (
                    <ListItemButton 
                        key={index} 
                        onClick={() => {
                            setActiveIndex(index);
                            navigate(item.path);
                            setMobileOpen(false);
                        }}
                        sx={{ 
                            color: activeIndex === index ? 'white' : 'black',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                        }}
                    >
                        <ListItemIcon sx={{ color: activeIndex === index ? 'white' : 'black' }}>
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
