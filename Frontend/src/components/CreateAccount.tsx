import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Grid, Box, Divider, Link, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

const CreateAccount: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        password: '',
        occupation: '',
        expertise: '',
        bio: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        password: '',
        occupation: '',
        expertise: '',
        bio: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear the error message when the user starts typing
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // First Name Validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        // Last Name Validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        // Email Validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        // Address Validation
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
            isValid = false;
        }

        // Password Validation
        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Occupation Validation
        if (!formData.occupation.trim()) {
            newErrors.occupation = 'Occupation is required';
            isValid = false;
        }

        // Expertise Validation
        if (!formData.expertise.trim()) {
            newErrors.expertise = 'Expertise is required';
            isValid = false;
        }

        // Bio Validation
        if (!formData.bio.trim()) {
            newErrors.bio = 'Bio is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Stop form submission if validation fails
        }

        const mutation = {
            query: `
                mutation CreateUser(
                    $firstName: String!,
                    $lastName: String!,
                    $email: String!,
                    $password: String!,
                    $address: String!,
                    $bio: String!,
                    $occupation: String!,
                    $expertise: String!,
                ) {
                    createUser(
                        firstName: $firstName,
                        lastName: $lastName,
                        email: $email,
                        password: $password,
                        address: $address,
                        bio: $bio,
                        occupation: $occupation,
                        expertise: $expertise,
                    ) {
                        user {
                            firstName
                            lastName
                            email
                            isMentor
                            bio
                            occupation
                            expertise
                        }
                        message
                    }
                }
            `,
            variables: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                address: formData.address,
                bio: formData.bio,
                occupation: formData.occupation,
                expertise: formData.expertise,
                isMentor: false
            }
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/graphql/', mutation);
            console.log('Account created successfully:', response.data);
            navigate('/login');
            // Handle success, e.g., redirect to login page or show a success message
        } catch (error) {
            console.error('Error creating account:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1, width: '100%', boxShadow: 2, borderRadius: 2, padding: 4 }} onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar> */}
                </Box>

                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
                    Create Account
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Firstname</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="firstName"
                            placeholder="Enter first name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            name="firstName"
                            autoComplete="fname"
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">Lastname</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter last name"
                            name="lastName"
                            autoComplete="lname"
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Email</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email"
                            name="email"
                            autoComplete="email"
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Address</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter address"
                            name="address"
                            autoComplete="address"
                            error={!!errors.address}
                            helperText={errors.address}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Password</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Occupation</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            placeholder="Enter occupation"
                            name="occupation"
                            error={!!errors.occupation}
                            helperText={errors.occupation}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Expertise</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="expertise"
                            value={formData.expertise}
                            onChange={handleInputChange}
                            placeholder="Enter expertise"
                            name="expertise"
                            error={!!errors.expertise}
                            helperText={errors.expertise}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Bio</Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Enter bio"
                            name="bio"
                            multiline
                            rows={4}
                            error={!!errors.bio}
                            helperText={errors.bio}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </Grid>
                    <Divider sx={{ width: '100%', backgroundColor: 'lightgray', my: 3 }} />
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mb: 2,
                                width: '70%',
                                backgroundColor: '#506FD6',
                                borderRadius: 2,
                                padding: 1
                            }}
                        >
                            Create Account
                        </Button>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, ml: 7 }}>
                        <Link href="/login" variant="body2" sx={{ textDecoration: 'none', color: 'black' }}>
                            {"Have an account? "}
                            <Typography component="span" sx={{ color: '#506FD6' }}>
                                Sign In
                            </Typography>
                        </Link>
                    </Box>
                </Grid>
            </Box>
        </Container>
    );
};

export default CreateAccount;