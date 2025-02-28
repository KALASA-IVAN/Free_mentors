import React from 'react';
import { Container, TextField, Button, Typography, Grid, Box, Divider, Link, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
const CreateAccount: React.FC = () => {
    return (
        <Container maxWidth="sm">
            
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1, width: '100%',boxShadow:2,
                        borderRadius: 2, padding: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                </Box>

                <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center',mb:2 }}>
                    Create Account
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" sx={{  }}>
                            Firstname
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="firstName"
                            placeholder="Enter first name"
                            name="firstName"
                            autoComplete="fname"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" sx={{  }}>
                            Lastname
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="lastName"
                            placeholder="Enter last name"
                            name="lastName"
                            autoComplete="lname"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <   Typography variant="subtitle1" sx={{  }}>
                            Email
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            placeholder="Enter email"
                            name="email"
                            autoComplete="email"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <   Typography variant="subtitle1" sx={{  }}>
                            Address
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="address"
                            placeholder="Enter address"
                            name="address"
                            autoComplete="address"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <   Typography variant="subtitle1" sx={{  }}>
                            Password
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            placeholder="Enter password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{  }}>
                            Occupation
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="occupation"
                            placeholder="Enter occupation"
                            name="occupation"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{  }}>
                            Expertise
                        </Typography>           
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="expertise"
                            placeholder="Enter expertise"
                            name="expertise"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{  }}>
                            Bio
                        </Typography>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="bio"
                            placeholder="Enter bio"
                            name="bio"
                            multiline
                            rows={4}
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