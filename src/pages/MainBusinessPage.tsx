import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Button, Typography, Box } from '@mui/material';

const MainBusinessPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('autoLogin');
    navigate('/login');
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
          Main Business Page
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default MainBusinessPage;