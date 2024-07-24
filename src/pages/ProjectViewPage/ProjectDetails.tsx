import React from 'react';
import { TextField, Button, Box } from '@mui/material';

interface ProjectDetailsProps {
  projectDetails: any;
  onSave: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectDetails, onSave }) => {
  return (
    <Box>
      <TextField
        label="Project Name"
        value={projectDetails.project_name}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Tags"
        value={projectDetails.tags?.join(', ')}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={onSave}>Save</Button>
    </Box>
  );
};

export default ProjectDetails;
