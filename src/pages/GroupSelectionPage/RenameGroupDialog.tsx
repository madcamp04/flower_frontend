import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

interface RenameGroupDialogProps {
  open: boolean;
  handleClose: () => void;
  newName: string;
  setNewName: (name: string) => void;
  handleRenameGroup: () => void;
  renameError: string;
}

const RenameGroupDialog: React.FC<RenameGroupDialogProps> = ({
  open,
  handleClose,
  newName,
  setNewName,
  handleRenameGroup,
  renameError
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
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
          error={!!renameError}
          helperText={renameError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleRenameGroup} color="primary">
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameGroupDialog;
