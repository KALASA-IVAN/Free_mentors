import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { 
    Container, CssBaseline, Typography, TextField, Button, 
    Box, Divider, Alert, CircularProgress, Link
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, token } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({ email: '', password: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const errors: any = {};
        const { email, password } = formData;

        if (!email) errors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email address.';

        if (!password) errors.password = 'Password is required.';
        else if (password.length < 8) errors.password = 'Password must be at least 8 characters long.';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) return;

        dispatch(loginUser(formData));
    };

    if (token) {
        navigate(formData.email === 'admin@example.com' ? '/admin/dashboard' : '/mentors');
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 2, borderRadius: 2, padding: 3 }}>
                    <Typography component="h1" variant="h5">Sign in</Typography>
                    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
                        <Typography variant="subtitle1">Email</Typography>
                        <TextField required fullWidth id="email" placeholder="Enter your email" name="email" autoComplete="email" autoFocus value={formData.email} onChange={handleInputChange} error={!!formErrors.email} helperText={formErrors.email} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Password</Typography>
                        <TextField required fullWidth name="password" type="password" id="password" autoComplete="current-password" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} error={!!formErrors.password} helperText={formErrors.password} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Link href="#" variant="body2" sx={{ textDecoration: 'none', color: '#506FD6' }}>Forgot password?</Link>
                        </Box>
                        <Divider sx={{ width: '100%', backgroundColor: 'lightgray', my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, width: '70%', backgroundColor: '#506FD6', borderRadius: 2 }} disabled={loading}>
                                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                            <Link href="/create-account" variant="body2" sx={{ textDecoration: 'none', color: 'black' }}>
                                {"Don't have an account? "}
                                <Typography component="span" sx={{ color: '#506FD6' }}>Sign Up</Typography>
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
