import React from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
  const handleRegister = () => {
    // Registration logic

    // Backend call example (commented out)
    // fetch('https://your-backend-api.com/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ id, password })
    // }).then(response => response.json())
    //   .then(data => {
    //     if (data.success) {
    //       // Redirect to login page
    //     } else {
    //       alert('Registration failed');
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
          Register
        </Typography>
        <TextField label="ID" variant="outlined" margin="normal" fullWidth />
        <TextField label="Password" type="password" variant="outlined" margin="normal" fullWidth />
        <TextField label="Confirm Password" type="password" variant="outlined" margin="normal" fullWidth />
        <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
          Register
        </Button>
        <Button component={Link} to="/login" variant="text" color="secondary">
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default Register;