import React from 'react';
import { Container, CssBaseline, Avatar, Typography, TextField, Button, Grid, Link, Box, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Login: React.FC = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow:2,
                        borderRadius: 2
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '80%', }}>
                    <Typography variant="subtitle1" sx={{  }}>
                        Email
                    </Typography>
                        <TextField
                            // margin="normal"
                            required
                            fullWidth
                            id="email"
                            placeholder="Enter your email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Password
                        </Typography>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2, 
                                }
                            }}
                        />
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt:2 }}>
                            <Link href="#" variant="body2" sx={{ textDecoration: 'none', color: '#506FD6' }}>
                                Forgot password?
                            </Link>
                        </Box>
                        <Divider sx={{ width: '100%', backgroundColor: 'lightgray', my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    width: '70%',
                                    backgroundColor: '#506FD6',
                                    borderRadius: 2, 
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                            <Link href="/create-account" variant="body2" sx={{ textDecoration: 'none', color: 'black' }}>
                                {"Don't have an account? "}
                                <Typography component="span" sx={{ color: '#506FD6', }}>
                                    Sign Up
                                </Typography>
                            </Link>
                        </Box>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;