import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Typography,
  Box,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  AppBar,
  Toolbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppContext } from '../context/AppContext';

interface Group {
  group_name: string;
  writeable: boolean;
  owner_username: string;
}

const GroupSelectionPage = () => {
  const { userName, setGroupName, setGroupOwner } = useAppContext();
  const [groups, setGroups] = useState<Group[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    fetch('/backend/api-group-selection/group-list', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setGroups(data.groups);
      })
      .catch(error => console.error('Error:', error));
  };

  const handleGroupClick = (group: Group) => {
    setGroupName(group.group_name);
    setGroupOwner(group.owner_username);
    navigate(`/group/${group.group_name}`);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddGroup = () => {
    fetch('/backend/api-group-selection/add-group', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_name: newGroupName })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        fetchGroups();
        handleClose();
      } else {
        console.error('Group creation failed:', data.message);
      }
    });
  };

  const handleLogout = () => {
    fetch('/backend/api-login/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(() => {
      navigate('/login');
    })
    .catch(() => {
      navigate('/login');
    });
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Welcome, {userName}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" paddingTop={2}>
        <Typography variant="h5" component="h2" gutterBottom>
          Your Groups
        </Typography>
        <Grid container spacing={2}>
          {groups.map((group, index) => (
            <Grid item xs={12} key={index}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleGroupClick(group)}
              >
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                  <Typography variant="h6">{group.group_name}</Typography>
                  <Typography variant="body2">Owner: {group.owner_username}</Typography>
                  <Typography variant="body2">Writeable: {group.writeable ? 'Yes' : 'No'}</Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the group name.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              fullWidth
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddGroup} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default GroupSelectionPage;
