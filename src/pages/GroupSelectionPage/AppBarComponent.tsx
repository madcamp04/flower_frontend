import React from 'react';
import { AppBar, Toolbar, Typography, Button, Divider } from '@mui/material';
import logo from '../../../public/Flower_logo.png';

interface AppBarComponentProps {
  userName: string;
  handleLogout: () => void;
}
const AppBarComponent: React.FC<AppBarComponentProps> = ({ userName, handleLogout }) => {
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#fff', height: 80, justifyContent: 'center' }}>
        <Toolbar>
        <img src={logo} alt="Logo" style={{ marginRight: 16, height: 55 }} />
          <Typography variant="h6" style={{ flexGrow: 1, color: '#000' }}>
            Welcome, {userName}
          </Typography>
          <Button color="inherit" onClick={handleLogout} style={{ color: '#000' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
    </>
  );
};

export default AppBarComponent;
