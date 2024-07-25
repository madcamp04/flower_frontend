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
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
  const [renameDialogOpen, setRenameDialogOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newName, setNewName] = useState<string>('');

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
    navigate(`/group/${encodeURIComponent(group.group_name)}`);
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

  const handleDeleteGroup = (group: Group) => {
    fetch('/backend/api-group-selection/delete-group', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: group.group_name,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchGroups();
        } else {
          console.error('Group deletion failed:', data.message);
        }
      });
  };

  const handleRenameGroup = () => {
    if (selectedGroup) {
      fetch('/backend/api-group-selection/update-group', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_user_name: userName,
          group_name: selectedGroup.group_name,
          new_group_name: newName,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            fetchGroups();
            setRenameDialogOpen(false);
          } else {
            console.error('Group update failed:', data.message);
          }
        });
    }
  };

  const openRenameDialog = (group: Group) => {
    setSelectedGroup(group);
    setNewName(group.group_name);
    setRenameDialogOpen(true);
  };

  const closeRenameDialog = () => {
    setRenameDialogOpen(false);
  };

  const ownedGroups = groups.filter(group => group.owner_username === userName);
  const otherGroups = groups.filter(group => group.owner_username !== userName);

  return (
    <Box style={{ width: '100vw', backgroundColor: '#f0f0f0', minHeight: '100vh', padding: 0 }}>
      <AppBar position="static" style={{ backgroundColor: '#fff', height: 80, justifyContent: 'center' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: '#000' }}>
            Welcome, {userName}
          </Typography>
          <Button color="inherit" onClick={handleLogout} style={{ color: '#000' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="calc(100vh - 80px)" paddingTop={2} paddingBottom={2}>
        <Typography variant="h5" component="h2" gutterBottom style={{ color: '#333' }}>
          Your Groups
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" style={{ color: '#333' }}>
              Groups You Own
            </Typography>
            {ownedGroups.map((group, index) => (
              <Paper elevation={3} style={{ width: '100%', marginTop: 8 }} key={index}>
                <Box display="flex" alignItems="center">
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleGroupClick(group)}
                    style={{ justifyContent: 'flex-start', backgroundColor: '#fff', color: '#000', textTransform: 'none', padding: '16px', borderColor: '#000' }}
                  >
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                      <Typography variant="h6">{group.group_name}</Typography>
                      <Typography variant="body2">Owner: {group.owner_username}</Typography>
                      <Typography variant="body2">Writeable: {group.writeable ? 'Yes' : 'No'}</Typography>
                    </Box>
                  </Button>
                  <IconButton onClick={() => openRenameDialog(group)} style={{ color: '#000' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteGroup(group)} style={{ color: '#000' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" style={{ color: '#333' }}>
              Other Groups
            </Typography>
            {otherGroups.map((group, index) => (
              <Paper elevation={3} style={{ width: '100%', marginTop: 8 }} key={index}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleGroupClick(group)}
                  style={{ justifyContent: 'flex-start', backgroundColor: '#fff', color: '#000', textTransform: 'none', padding: '16px', borderColor: '#000' }}
                >
                  <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <Typography variant="h6">{group.group_name}</Typography>
                    <Typography variant="body2">Owner: {group.owner_username}</Typography>
                    <Typography variant="body2">Writeable: {group.writeable ? 'Yes' : 'No'}</Typography>
                  </Box>
                </Button>
              </Paper>
            ))}
          </Grid>
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'fixed', bottom: 16, right: 16, backgroundColor: '#000', color: '#fff' }}
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
        <Dialog open={renameDialogOpen} onClose={closeRenameDialog}>
          <DialogTitle>Rename Group</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the new group name.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="New Group Name"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeRenameDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleRenameGroup} color="primary">
              Rename
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default GroupSelectionPage;
