import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';

interface AddWorkerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newWorker: { user_name: string; user_email: string }) => void;
}

const AddWorkerDialog: React.FC<AddWorkerDialogProps> = ({ open, onClose, onSubmit }) => {
  const [user_name, setUserName] = useState('');
  const [user_email, setUserEmail] = useState('');

  const handleSubmit = () => {
    if (user_name && user_email) {
      onSubmit({ user_name, user_email });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Worker</DialogTitle>
      <DialogContent>
        <TextField
          label="Worker Name"
          value={user_name}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Worker Email"
          value={user_email}
          onChange={(e) => setUserEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add Worker</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkerDialog;
