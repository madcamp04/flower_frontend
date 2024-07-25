import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

interface DeleteGroupDialogProps {
  open: boolean;
  handleClose: () => void;
  deleteGroupName: string;
  setDeleteGroupName: (name: string) => void;
  handleDeleteGroup: () => void;
  deleteError: boolean;
}

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({
  open,
  handleClose,
  deleteGroupName,
  setDeleteGroupName,
  handleDeleteGroup,
  deleteError
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please type the group name to confirm deletion.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          fullWidth
          value={deleteGroupName}
          onChange={(e) => setDeleteGroupName(e.target.value)}
          error={deleteError}
          helperText={deleteError ? "Group name does not match" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleDeleteGroup} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteGroupDialog;
