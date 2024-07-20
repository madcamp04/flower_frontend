import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material';

interface LocationState {
  group_name?: string;
  owner_name?: string;
  user_name?: string;
}

const GroupViewPage = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    group_name = 'Unknown Group',
    owner_name = 'Unknown Owner',
    user_name = Cookies.get('userName') || 'Unknown User', // Default to cookie value if available
  } = (location.state || {}) as LocationState;

  useEffect(() => {
    const userToken = Cookies.get('authToken');
    console.log('GroupViewPage: userToken:', userToken);
    if (!userToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('autoLogin');
    Cookies.remove('userName');
    navigate('/login');
  };

  console.log("GroupViewPage: group_id:", group_id);

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Welcome, {user_name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" paddingTop={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Group: {group_name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Owner: {owner_name}
        </Typography>
      </Box>
    </Container>
  );
};

export default GroupViewPage;