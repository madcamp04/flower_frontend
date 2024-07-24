import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface ProjectDetailsProps {
  projectDetails: any;
  onSave: (updatedProject: any) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectDetails, onSave }) => {
  const [projectName, setProjectName] = useState(projectDetails.project_name || '');
  const [tags, setTags] = useState(projectDetails.tags?.join(', ') || '');

  const handleSave = () => {
    onSave({
      project_name: projectName,
      tags: tags.split(',').map(tag => tag.trim())
    });
  };

  return (
    <Box>
      <TextField
        label="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleSave}>Save</Button>
    </Box>
  );
};

export default ProjectDetails;
