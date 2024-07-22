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

interface Group {
  group_id: number;
  group_name: string;
  owner_user_id: number;
  user_id: number;
  writable: boolean;
  user_name: string;
}

const GroupSelectionPage = () => {
  const [userName, setUserName] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newGroupOwner, setNewGroupOwner] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('/backend/api-login/auto-login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('groupselectionpage Auto-login successful:', data);
        setUserName(data.username);
        fetchGroups(data.username);
      } else {
        navigate('/login');
      }
    });
  }, [navigate]);

  const fetchGroups = (userName: string) => {
    // Dummy data
    const dummyGroups: Group[] = [
      { group_id: 1, group_name: 'Group 1', owner_user_id: 1, user_id: 1, writable: true, user_name: 'Owner 1' },
      { group_id: 2, group_name: 'Group 2', owner_user_id: 2, user_id: 1, writable: false, user_name: 'Owner 2' },
      { group_id: 3, group_name: 'Group 3', owner_user_id: 3, user_id: 1, writable: true, user_name: 'Owner 3' },
    ];

    // Sort groups by writability
    const sortedGroups = dummyGroups.sort((a, b) => (b.writable ? 1 : 0) - (a.writable ? 1 : 0));
    setGroups(sortedGroups);

    // Backend call example (commented out)
    // fetch('/backend/api-login/groups', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ user_name: userName })
    // }).then(response => response.json())
    //   .then(data => {
    //     const sortedGroups = data.groups.sort((a, b) => (b.writable ? 1 : 0) - (a.writable ? 1 : 0));
    //     setGroups(sortedGroups);
    //   });
  };

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.group_id}`, { state: { group_name: group.group_name, owner_name: group.user_name, user_name: userName } });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddGroup = () => {
    // Dummy add group logic
    const newGroup: Group = {
      group_id: groups.length + 1,
      group_name: newGroupName,
      owner_user_id: groups.length + 1, // Dummy owner id
      user_id: groups.length + 1, // Dummy user id
      writable: true,
      user_name: newGroupOwner
    };
    setGroups([...groups, newGroup]);
    handleClose();

    // Backend call example (commented out)
    // fetch('/backend/api-login/add-group', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ user_name: userName, group_name: newGroupName, owner_user_name: newGroupOwner })
    // }).then(response => response.json())
    //   .then(data => {
    //     setGroups([...groups, data.newGroup]);
    //     handleClose();
    //   });
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
    .then(data => {
      if (data.success) {
        navigate('/login');
      } else {
        console.error('Logout failed:', data.message);
        navigate('/login');
      }
    })
    .catch(error => {
      console.error('Logout error:', error);
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
          {groups.map((group) => (
            <Grid item xs={12} key={group.group_id}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleGroupClick(group)}
              >
                <Box display="flex" flexDirection="column" alignItems="flex-start">
                  <Typography variant="h6">{group.group_name}</Typography>
                  <Typography variant="body2">Owner: {group.user_name}</Typography>
                  <Typography variant="body2">Writeable: {group.writable ? 'Yes' : 'No'}</Typography>
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
              Please enter the group name and owner user name.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              fullWidth
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Owner User Name"
              fullWidth
              value={newGroupOwner}
              onChange={(e) => setNewGroupOwner(e.target.value)}
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