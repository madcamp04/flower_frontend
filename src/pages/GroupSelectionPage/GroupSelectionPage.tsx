import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Fab, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppContext } from '../../context/AppContext';
import AppBarComponent from './AppBarComponent';
import GroupListComponent from './GroupListComponent';
import AddGroupDialog from './AddGroupDialog';
import RenameGroupDialog from './RenameGroupDialog';
import DeleteGroupDialog from './DeleteGroupDialog';

interface Group {
  group_name: string;
  writeable: boolean;
  owner_username: string;
}

const GroupSelectionPage = () => {
  const { userName, setGroupName, setGroupOwner } = useAppContext();
  const [groups, setGroups] = useState<Group[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [openRenameDialog, setOpenRenameDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [deleteGroupName, setDeleteGroupName] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [deleteError, setDeleteError] = useState<boolean>(false);
  const [renameError, setRenameError] = useState<string>('');

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
    navigate(`/group`);
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
        setOpenAddDialog(false);
      } else {
        console.error('Group creation failed:', data.message);
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
            setOpenRenameDialog(false);
          } else {
            console.error('Group update failed:', data.message);
            setRenameError(data.message);
          }
        })
        .catch(error => {
          console.error('Group update failed:', error);
          setRenameError('An error occurred while renaming the group.');
        });
    }
  };

  const handleDeleteGroup = () => {
    if (selectedGroup && deleteGroupName === selectedGroup.group_name) {
      fetch('/backend/api-group-selection/delete-group', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_user_name: userName,
          group_name: selectedGroup.group_name,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            fetchGroups();
            setOpenDeleteDialog(false);
          } else {
            console.error('Group deletion failed:', data.message);
          }
        });
    } else {
      setDeleteError(true);
    }
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

  const openAddGroupDialog = () => setOpenAddDialog(true);
  const closeAddGroupDialog = () => setOpenAddDialog(false);

  const openRenameGroupDialog = (group: Group) => {
    setSelectedGroup(group);
    setNewName(group.group_name);
    setRenameError('');
    setOpenRenameDialog(true);
  };
  const closeRenameGroupDialog = () => setOpenRenameDialog(false);

  const openDeleteGroupDialog = (group: Group) => {
    setSelectedGroup(group);
    setDeleteGroupName('');
    setDeleteError(false);
    setOpenDeleteDialog(true);
  };
  const closeDeleteGroupDialog = () => setOpenDeleteDialog(false);

  const ownedGroups = groups.filter(group => group.owner_username === userName);
  const otherGroups = groups.filter(group => group.owner_username !== userName);

  return (
    <Box style={{ width: '100vw', backgroundColor: '#f0f0f0', minHeight: '100vh', padding: 0 }}>
      <AppBarComponent userName={userName} handleLogout={handleLogout} />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="calc(100vh - 80px)">
        <Grid container spacing={2}>
          <GroupListComponent
            groups={ownedGroups}
            title="Groups You Own"
            handleGroupClick={handleGroupClick}
            openRenameGroupDialog={openRenameGroupDialog}
            openDeleteGroupDialog={openDeleteGroupDialog}
          />
          <GroupListComponent
            groups={otherGroups}
            title="Other Groups"
            handleGroupClick={handleGroupClick}
            openRenameGroupDialog={openRenameGroupDialog}
            openDeleteGroupDialog={openDeleteGroupDialog}
          />
        </Grid>
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: 'fixed', bottom: 16, right: 16, backgroundColor: '#000', color: '#fff' }}
          onClick={openAddGroupDialog}
        >
          <AddIcon />
        </Fab>
        <AddGroupDialog
          open={openAddDialog}
          handleClose={closeAddGroupDialog}
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
          handleAddGroup={handleAddGroup}
        />
        {selectedGroup && (
          <RenameGroupDialog
            open={openRenameDialog}
            handleClose={closeRenameGroupDialog}
            newName={newName}
            setNewName={setNewName}
            handleRenameGroup={handleRenameGroup}
            renameError={renameError}
          />
        )}
        {selectedGroup && (
          <DeleteGroupDialog
            open={openDeleteDialog}
            handleClose={closeDeleteGroupDialog}
            deleteGroupName={deleteGroupName}
            setDeleteGroupName={setDeleteGroupName}
            handleDeleteGroup={handleDeleteGroup}
            deleteError={deleteError}
          />
        )}
      </Box>
    </Box>
  );
};

export default GroupSelectionPage;

