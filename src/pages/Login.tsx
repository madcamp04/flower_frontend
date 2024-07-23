import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserName } = useAppContext();
  const from = location.state?.from?.pathname || '/group-selection';

  const handleLogin = () => {
    fetch(`/backend/api-login/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: id, password, remember_me: autoLogin })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setUserName(data.username);
        navigate(from, { replace: true });
      } else {
        alert('Invalid credentials');
      }
    })
    .catch(() => {
      alert('Login error');
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <TextField
          label="ID"
          variant="outlined"
          margin="normal"
          fullWidth
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FormControlLabel
          control={<Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)} />}
          label="Remember me"
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
        <Button component={Link} to="/register" variant="text" color="secondary">
          Register
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
