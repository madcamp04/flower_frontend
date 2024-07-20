import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const Register = () => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ id: '', email: '', password: '', confirmPassword: '' });
  const [uniqueCheck, setUniqueCheck] = useState({ id: false, email: false });
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 16;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/g;

    if (password.length < minLength || password.length > maxLength) {
      return 'Password must be 8-16 characters long';
    }

    if (!specialChar.test(password)) {
      return 'Password must contain at least one special character';
    }

    return '';
  };

  const checkIdUniqueness = () => {
    // Dummy uniqueness check for ID
    let idError = '';

    if (id === 'existingUser') {
      idError = 'ID already exists';
    }

    if (idError) {
      setErrors((prevErrors) => ({ ...prevErrors, id: idError }));
      setUniqueCheck((prevCheck) => ({ ...prevCheck, id: false }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, id: '' }));
      setUniqueCheck((prevCheck) => ({ ...prevCheck, id: true }));
      alert('ID is unique');
    }

    // Backend call example (commented out)
    // fetch('https://your-backend-api.com/api/login/check-username', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username: id })
    // }).then(response => response.json())
    //   .then(data => {
    //     if (data.is_unique) {
    //       setUniqueCheck((prevCheck) => ({ ...prevCheck, id: true }));
    //       alert('ID is unique');
    //     } else {
    //       setErrors((prevErrors) => ({ ...prevErrors, id: 'ID already exists' }));
    //       setUniqueCheck((prevCheck) => ({ ...prevCheck, id: false }));
    //     }
    //   });
  };

  const checkEmailUniqueness = () => {
    // Dummy uniqueness check for Email
    let emailError = '';

    if (email === 'existing@example.com') {
      emailError = 'Email already exists';
    }

    if (emailError) {
      setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
      setUniqueCheck((prevCheck) => ({ ...prevCheck, email: false }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
      setUniqueCheck((prevCheck) => ({ ...prevCheck, email: true }));
      alert('Email is unique');
    }

    // Backend call example (commented out)
    // fetch('https://your-backend-api.com/api/login/check-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: email })
    // }).then(response => response.json())
    //   .then(data => {
    //     if (data.is_unique) {
    //       setUniqueCheck((prevCheck) => ({ ...prevCheck, email: true }));
    //       alert('Email is unique');
    //     } else {
    //       setErrors((prevErrors) => ({ ...prevErrors, email: 'Email already exists' }));
    //       setUniqueCheck((prevCheck) => ({ ...prevCheck, email: false }));
    //     }
    //   });
  };

  const handleRegister = () => {
    const passwordError = validatePassword(password);
    const confirmPasswordError = password !== confirmPassword ? 'Passwords do not match' : '';
    const idError = id ? '' : 'ID is required';
    const emailError = email ? '' : 'Email is required';

    if (passwordError || confirmPasswordError || idError || emailError || !uniqueCheck.id || !uniqueCheck.email) {
      setErrors({
        id: idError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      if (!uniqueCheck.id) {
        setErrors((prevErrors) => ({ ...prevErrors, id: 'ID uniqueness not checked' }));
      }
      if (!uniqueCheck.email) {
        setErrors((prevErrors) => ({ ...prevErrors, email: 'Email uniqueness not checked' }));
      }
      return;
    }

    // Registration logic
    alert('Registration successful');
    navigate('/login');

    // Backend call example (commented out)
    // fetch('https://your-backend-api.com/api/login/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username: id, email, password })
    // }).then(response => response.json())
    //   .then(data => {
    //     if (data.success) {
    //       alert('Registration successful');
    //       navigate('/login');
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
        <TextField
          label="ID"
          variant="outlined"
          margin="normal"
          fullWidth
          value={id}
          onChange={(e) => setId(e.target.value)}
          error={!!errors.id}
          helperText={errors.id}
        />
        <Button variant="contained" color="primary" fullWidth onClick={checkIdUniqueness}>
          Check ID Uniqueness
        </Button>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
        />
        <Button variant="contained" color="primary" fullWidth onClick={checkEmailUniqueness}>
          Check Email Uniqueness
        </Button>
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password || 'Password must be 8-16 characters long and contain at least one special character'}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleRegister} style={{ marginTop: '10px' }}>
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