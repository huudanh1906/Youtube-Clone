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

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        try {
            setLoading(true);
            await login(username, password);
            history.push('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginPageContainer>
            <StyledPaper elevation={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign In
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>
                </form>

                <Box mt={2}>
                    <Typography>
                        Don't have an account? <StyledLink to="/register">Register now</StyledLink>
                    </Typography>
                </Box>
            </StyledPaper>
        </LoginPageContainer>
    );
};

const LoginPageContainer = styled.div`
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

export default LoginPage; 