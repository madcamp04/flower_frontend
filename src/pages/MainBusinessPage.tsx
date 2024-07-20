import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Button, Typography, Box } from '@mui/material';

const MainBusinessPage = () => {
  const [userName, setUserName] = useState('');
  const [userToken, setUserToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userName = Cookies.get('userName');
    const userToken = Cookies.get('authToken');
    if (!userName || !userToken) {
      navigate('/login');
    } else {
      setUserName(userName);
      setUserToken(userToken);
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('autoLogin');
    Cookies.remove('userName');
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
          Welcome, {userName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your token: {userToken}
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default MainBusinessPage;