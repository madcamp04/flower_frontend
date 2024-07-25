import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

interface DeleteProjectConfirmationDialogProps {
  open: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteProjectConfirmationDialog: React.FC<DeleteProjectConfirmationDialogProps> = ({ open, projectName, onClose, onConfirm }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(false);
  };

  const handleConfirm = () => {
    if (input === projectName) {
      onConfirm();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>To confirm deletion, please type the project name: <strong>{projectName}</strong></Typography>
        <TextField
          fullWidth
          margin="normal"
          variant="outlined"
          value={input}
          onChange={handleInputChange}
          error={error}
          helperText={error ? "Project name does not match" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="secondary" onClick={handleConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProjectConfirmationDialog;
