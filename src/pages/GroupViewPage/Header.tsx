import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

interface HeaderProps {
  user_name: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user_name, onLogout }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Welcome, {user_name}
      </Typography>
      <Button color="inherit" onClick={onLogout}>
        Logout
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header;
