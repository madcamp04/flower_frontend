import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import TagsSelector from './TagsSelector';
import { useNavigate } from 'react-router-dom';
import logo from '../../../public/Flower_logo.png';

interface HeaderProps {
  groupName: string;
  groupOwner: string;
  allTags: string[];
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
  projectNames: string[];
  handleProjectChange: (event: any, value: string | null) => void;
  handleLogout: () => void;
  setOpenAddTaskDialog: (open: boolean) => void;
  setOpenAddWorkerDialog: (open: boolean) => void;
  setOpenAddProjectDialog: (open: boolean) => void;
  setOpenAddTagDialog: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  groupName,
  groupOwner,
  allTags,
  activeTags,
  setActiveTags,
  projectNames,
  handleProjectChange,
  handleLogout,
  setOpenAddTaskDialog,
  setOpenAddWorkerDialog,
  setOpenAddProjectDialog,
  setOpenAddTagDialog,
}) => {
  const navigate = useNavigate();
  const popupState = usePopupState({ variant: 'popover', popupId: 'createNewMenu' });

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', height: '80px', boxShadow: 'none', borderBottom: '1px solid gray' }}>
      <Toolbar sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ marginRight: 16, height: 55 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {groupName}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'gray' }}>
            {groupOwner}
          </Typography>
        </Box>
        <TagsSelector tags={allTags} activeTags={activeTags} setActiveTags={setActiveTags} />
        <Autocomplete
          options={projectNames}
          renderInput={(params) => <TextField {...params} label="Select Project" variant="outlined" />}
          onChange={handleProjectChange}
          sx={{ width: 300, ml: 2 }}
        />
        <Button {...bindTrigger(popupState)} variant="outlined" sx={{ ml: 2, backgroundColor: 'white', color: 'black', border: '1px solid black', fontWeight: 'bold' }}>
          Create New
        </Button>
        <Menu {...bindMenu(popupState)}>
          <MenuItem onClick={() => { setOpenAddTaskDialog(true); popupState.close(); }}>Add Task</MenuItem>
          <MenuItem onClick={() => { setOpenAddWorkerDialog(true); popupState.close(); }}>Add Worker</MenuItem>
          <MenuItem onClick={() => { setOpenAddProjectDialog(true); popupState.close(); }}>Add Project</MenuItem>
          <MenuItem onClick={() => { setOpenAddTagDialog(true); popupState.close(); }}>Add Tag</MenuItem>
        </Menu>
        <Button onClick={handleLogout} variant="outlined" sx={{ ml: 2, backgroundColor: 'white', color: 'black', border: '1px solid black', fontWeight: 'bold' }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
