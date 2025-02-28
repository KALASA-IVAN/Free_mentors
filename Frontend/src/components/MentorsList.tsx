import React, { useState } from 'react';
import SideBar from '../constants/SideBar';
import { 
  Box, 
  Avatar, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';

interface Mentor {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    bio: string;
    occupation: string;
    expertise: string;
    profilePicture: string;
}

interface BookingDetails {
    date: string;
    time: string;
    reason: string;
    duration: number;
}

const mentors: Mentor[] = [
    { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', address: 'NY, USA', bio: 'Expert in Full-Stack Development.', occupation: 'Software Engineer', expertise: 'Business and Entrepreneurship', profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 2, firstName: 'Michael', lastName: 'Smith', email: 'michael@example.com', address: 'Toronto, Canada', bio: 'Expert in Cybersecurity.', occupation: 'Cybersecurity Specialist', expertise: 'Technology and Engineering', profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 3, firstName: 'Sophia', lastName: 'Williams', email: 'sophia@example.com', address: 'London, UK', bio: 'Data Scientist focused on AI.', occupation: 'Data Scientist', expertise: 'Business and Entrepreneurship', profilePicture: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: 4, firstName: 'James', lastName: 'Brown', email: 'james@example.com', address: 'Sydney, Australia', bio: 'Cloud Computing Architect.', occupation: 'Cloud Architect', expertise: 'Technology and Engineering', profilePicture: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 5, firstName: 'Emily', lastName: 'Davis', email: 'emily@example.com', address: 'Los Angeles, USA', bio: 'Product Manager with experience in startups.', occupation: 'Product Manager', expertise: 'Business and Entrepreneurship', profilePicture: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { id: 6, firstName: 'John', lastName: 'Miller', email: 'john@example.com', address: 'Vancouver, Canada', bio: 'AI Researcher and Developer.', occupation: 'AI Researcher', expertise: 'Technology and Engineering', profilePicture: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { id: 7, firstName: 'Lily', lastName: 'Wilson', email: 'lily@example.com', address: 'Paris, France', bio: 'Specialist in Data Engineering.', occupation: 'Data Engineer', expertise: 'Technology and Engineering', profilePicture: 'https://randomuser.me/api/portraits/women/7.jpg' }
];

// Group mentors by expertise
const groupedMentors = mentors.reduce((acc, mentor) => {
    acc[mentor.expertise] = acc[mentor.expertise] || [];
    acc[mentor.expertise].push(mentor);
    return acc;
}, {} as Record<string, Mentor[]>);

const MentorsList: React.FC = () => {
    const [visibleMentors, setVisibleMentors] = useState<number>(6);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [bookingOpen, setBookingOpen] = useState<boolean>(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
        date: '',
        time: '',
        reason: '',
        duration: 30
    });

    const handleSeeMore = () => {
        setVisibleMentors((prev) => prev + 6);
    };

    const handleOpenModal = (mentor: Mentor) => {
        setSelectedMentor(mentor);
    };

    const handleCloseModal = () => {
        setSelectedMentor(null);
    };

    const handleOpenBooking = () => {
        setBookingOpen(true);
    };

    const handleCloseBooking = () => {
        setBookingOpen(false);
    };

    const handleBookingChange = (field: keyof BookingDetails, value: any) => {
        setBookingDetails(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitBooking = () => {
        console.log("Booking submitted for mentor:", selectedMentor);
        console.log("Booking details:", bookingDetails);
        
        handleCloseBooking();
        handleCloseModal();
        setBookingDetails({
            date: '',
            time: '',
            reason: '',
            duration: 30
        });
        
        alert("Session booked successfully!");
    };

    return (
        <Box display="flex">
            <SideBar />
            <Box flex={1} p={4}>
                <Typography variant="h4" align="center" gutterBottom sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    Mentors
                </Typography>

                {Object.entries(groupedMentors).map(([expertise, mentorsInGroup]) => (
                    <Box key={expertise} mb={4}>
                        <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            {expertise}
                        </Typography>
                        <Box display="flex" gap={3} flexWrap="wrap" sx={{ ml: "10%", pt: 2 }}>
                            {mentorsInGroup.slice(0, visibleMentors).map((mentor) => (
                                <Box key={mentor.id} display="flex" flexDirection="column" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => handleOpenModal(mentor)}>
                                    <Avatar src={mentor.profilePicture} sx={{ width: 64, height: 64 }} />
                                    <Typography>{`${mentor.firstName} ${mentor.lastName}`}</Typography>
                                </Box>
                            ))}
                        </Box>
                        {mentorsInGroup.length > visibleMentors && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleSeeMore}>
                                    See more
                                </Button>
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>

            <Dialog open={!!selectedMentor} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogContent>
                    {selectedMentor && (
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar src={selectedMentor.profilePicture} sx={{ width: 80, height: 80, mb: 2 }} />
                            <Typography variant="h6">{`${selectedMentor.firstName} ${selectedMentor.lastName}`}</Typography>
                            <Typography variant="body2" color="textSecondary">{selectedMentor.email}</Typography>
                            <Typography variant="body2"><strong>Occupation:</strong> {selectedMentor.occupation}</Typography>
                            <Typography variant="body2"><strong>Expertise:</strong> {selectedMentor.expertise}</Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>{selectedMentor.bio}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-between", mb: 2 }}>
                    <Button variant="outlined" color="primary" onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleOpenBooking}>Book Session</Button>
                </DialogActions>
            </Dialog>

    
            <Dialog open={bookingOpen} onClose={handleCloseBooking} fullWidth maxWidth="sm">
                <DialogTitle>Book a Session</DialogTitle>
                <DialogContent>
                    {selectedMentor && (
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Schedule a session with {selectedMentor.firstName} {selectedMentor.lastName}
                            </Typography>
                            
                            <Stack spacing={3} sx={{ mt: 2 }}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    value={bookingDetails.date}
                                    onChange={(e) => handleBookingChange('date', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                                
                                <TextField
                                    label="Time"
                                    type="time"
                                    value={bookingDetails.time}
                                    onChange={(e) => handleBookingChange('time', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                                
                                <FormControl fullWidth>
                                    <InputLabel id="duration-label">Session Duration</InputLabel>
                                    <Select
                                        labelId="duration-label"
                                        value={bookingDetails.duration}
                                        label="Session Duration"
                                        onChange={(e) => handleBookingChange('duration', e.target.value)}
                                    >
                                        <MenuItem value={15}>15 minutes</MenuItem>
                                        <MenuItem value={30}>30 minutes</MenuItem>
                                        <MenuItem value={45}>45 minutes</MenuItem>
                                        <MenuItem value={60}>60 minutes</MenuItem>
                                    </Select>
                                </FormControl>
                                
                                <TextField
                                    label="Reason for Session"
                                    multiline
                                    rows={4}
                                    value={bookingDetails.reason}
                                    onChange={(e) => handleBookingChange('reason', e.target.value)}
                                    fullWidth
                                    placeholder="Briefly describe what you'd like to discuss in this session..."
                                />
                            </Stack>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBooking} variant="outlined">Cancel</Button>
                    <Button 
                        onClick={handleSubmitBooking} 
                        variant="contained" 
                        color="primary"
                        disabled={!bookingDetails.date || !bookingDetails.time || !bookingDetails.reason}
                    >
                        Confirm Booking
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MentorsList;