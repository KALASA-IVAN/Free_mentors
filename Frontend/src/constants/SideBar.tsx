import React, { useState } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Button, Avatar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/Inbox';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const SideBar: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const navigate = useNavigate();

    const items = [
        { text: `Mentors' directory`, icon: <SupervisedUserCircleIcon />, path: '/mentors' },
        { text: 'Requests', icon: <QuestionAnswerIcon />, path: '/requests' },
        { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
        { text: 'Messages', icon: <InboxIcon />, path: '/messages' },
    ];

    return (
        <Drawer 
            variant="permanent" 
            anchor="left" 
            sx={{ display: 'flex', flexDirection: 'column', height: '100%', '& .MuiDrawer-paper': { 
                width: '20%', 
                boxSizing: 'border-box' 
            } }}
        >
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
                        onClick={() => navigate('/logout')}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default SideBar;
