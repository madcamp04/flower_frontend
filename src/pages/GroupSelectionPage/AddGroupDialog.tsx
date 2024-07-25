import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

interface AddGroupDialogProps {
  open: boolean;
  handleClose: () => void;
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  handleAddGroup: () => void;
}

const AddGroupDialog: React.FC<AddGroupDialogProps> = ({
  open,
  handleClose,
  newGroupName,
  setNewGroupName,
  handleAddGroup
}) => {
  return (
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
  );
};

export default AddGroupDialog;
