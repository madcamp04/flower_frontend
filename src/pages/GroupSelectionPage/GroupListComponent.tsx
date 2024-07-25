import React from 'react';
import { Grid, Paper, Box, Button, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Group {
  group_name: string;
  writeable: boolean;
  owner_username: string;
}

interface GroupListComponentProps {
  groups: Group[];
  title: string;
  handleGroupClick: (group: Group) => void;
  openRenameGroupDialog: (group: Group) => void;
  openDeleteGroupDialog: (group: Group) => void;
}

const GroupListComponent: React.FC<GroupListComponentProps> = ({
  groups,
  title,
  handleGroupClick,
  openRenameGroupDialog,
  openDeleteGroupDialog
}) => {
  return (
    <Grid item xs={12}>
      <Typography variant="h6" style={{ color: '#333' }}>
        {title}
      </Typography>
      {groups.map((group, index) => (
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
            <IconButton onClick={() => openRenameGroupDialog(group)} style={{ color: '#000' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => openDeleteGroupDialog(group)} style={{ color: '#000' }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Grid>
  );
};

export default GroupListComponent;
