import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Button } from '@mui/material';
import { FaHome, FaChartBar, FaCalendarAlt, FaBell, FaUser, FaUsers, FaBan } from 'react-icons/fa';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const AdminsSidebar = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = [
        { text: 'Overview', icon: <FaHome />, path: '/admin/dashboard' },
        { text: 'Notifications', icon: <FaBell /> },
        { text: `Mentors' List`, icon: <FaUser />, path: '/mentors' },
        { text: 'Users', icon: <FaUsers />, path: '/admin/users' },
        // { text: 'Reported Users', icon: <FaBan />, path: '/admin/reported-users' },
    ];
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
            sx={{ display: 'flex', flexDirection: 'column', height: '100%', '& .MuiDrawer-paper': { 
                width: '20%', 
                boxSizing: 'border-box',
                backgroundColor: '#506FD6',
                color: 'white'
            } }}
        >
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                    <Typography variant="h6" sx={{ color: 'white' }}>Admin Panel</Typography>
                </Box>

                <List sx={{ flexGrow: 1, mt: '20%', ml: '12%' }}>
                    {items.map((item, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => {
                                setActiveIndex(index);
                                navigate(item.path);
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
