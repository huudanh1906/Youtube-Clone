import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components/macro';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    FormHelperText
} from '@material-ui/core';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();
    const history = useHistory();

    const validateForm = () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return false;
        }

        if (username.length < 3 || username.length > 20) {
            setError('Username must be between 3 and 20 characters');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
            return false;
        }

        if (password.length < 6 || password.length > 40) {
            setError('Password must be between 6 and 40 characters');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await register(username, email, password);
            setSuccess(true);
            setTimeout(() => {
                history.push('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterPageContainer>
            <StyledPaper elevation={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Account
                </Typography>

                {success ? (
                    <Box mt={2}>
                        <Typography variant="body1" color="primary">
                            Registration successful! Redirecting to login...
                        </Typography>
                    </Box>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            helperText="Username must be between 3 and 20 characters"
                        />

                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            helperText="Password must be between 6 and 40 characters"
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />

                        {error && (
                            <FormHelperText error>{error}</FormHelperText>
                        )}

                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading}
                            style={{ marginTop: '1rem' }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                    </form>
                )}

                <Box mt={2}>
                    <Typography>
                        Already have an account? <StyledLink to="/login">Sign in</StyledLink>
                    </Typography>
                </Box>
            </StyledPaper>
        </RegisterPageContainer>
    );
};

const RegisterPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: #f5f5f5;
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  max-width: 400px;
  width: 100%;
`;

const StyledLink = styled(Link)`
  color: #2c77db;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default RegisterPage; 