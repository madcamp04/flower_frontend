import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Chip,
  Autocomplete
} from '@mui/material';
import { Project } from './utils';

interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newProject: Project) => void;
  existingTags: string[];
}

const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ open, onClose, onSubmit, existingTags }) => {
  const [project_name, setProjectName] = useState('');
  const [project_description, setProjectDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = () => {
    if (project_name && project_description && tags.length > 0) {
      onSubmit({
        project_name,
        project_description,
        tags,
        tasks: [],
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent>
        <TextField
          label="Project Name"
          value={project_name}
          onChange={(e) => setProjectName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Project Description"
          value={project_description}
          onChange={(e) => setProjectDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Autocomplete
          multiple
          freeSolo
          options={existingTags}
          value={tags}
          onChange={(event, newValue) => {
            setTags(newValue);
          }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tags"
              placeholder="Add tags"
              margin="normal"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add Project</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectDialog;
