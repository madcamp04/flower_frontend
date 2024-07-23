import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField
} from '@mui/material';
import { ChromePicker } from 'react-color';

interface AddTagDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newTag: { tag_name: string; tag_color: string }) => void;
}

const AddTagDialog: React.FC<AddTagDialogProps> = ({ open, onClose, onSubmit }) => {
  const [tag_name, setTagName] = useState('');
  const [tag_color, setTagColor] = useState('#000000');

  const handleSubmit = () => {
    if (tag_name && tag_color) {
      onSubmit({
        tag_name,
        tag_color
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Tag</DialogTitle>
      <DialogContent>
        <TextField
          label="Tag Name"
          value={tag_name}
          onChange={(e) => setTagName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <ChromePicker
          color={tag_color}
          onChangeComplete={(color) => setTagColor(color.hex)}
          disableAlpha
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add Tag</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTagDialog;
