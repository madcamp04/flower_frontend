import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/group-selection';

  const handleLogin = () => {
    // Dummy authentication logic
    if (id === 'test' && password === 'password') {
      const userName = id;
      const userToken = 'dummyAuthToken'; // This should come from the backend

      // Set cookies
      Cookies.set('authToken', userToken, { expires: autoLogin ? 7 : 1 });
      Cookies.set('autoLogin', autoLogin.toString());
      Cookies.set('userName', userName, { expires: autoLogin ? 7 : 1 });

      navigate(from, { replace: true });
    } else {
      alert('Invalid credentials');
    }

    // Backend call example (commented out)
    // fetch('https://your-backend-api.com/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ id, password })
    // }).then(response => response.json())
    //   .then(data => {
    //     if (data.success) {
    //       const userName = data.user_name;
    //       const userToken = data.user_token;

    //       // Set cookies
    //       Cookies.set('authToken', userToken, { expires: autoLogin ? 7 : 1 });
    //       Cookies.set('autoLogin', autoLogin.toString());
    //       Cookies.set('userName', userName, { expires: autoLogin ? 7 : 1 });

    //       navigate(from, { replace: true });
    //     } else {
    //       alert('Invalid credentials');
    //     }
    //   });
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
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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