import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Chip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface ProjectDetailsProps {
  projectDetails: any;
  onSave: (updatedProject: any) => void;
  existingTags: string[];
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectDetails, onSave, existingTags }) => {
  const [projectName, setProjectName] = useState(projectDetails.project_name || '');
  const [tags, setTags] = useState<string[]>(projectDetails.tags || []);

  useEffect(() => {
    setProjectName(projectDetails.project_name || '');
    setTags(projectDetails.tags || []);
  }, [projectDetails]);

  const handleSave = () => {
    onSave({
      project_name: projectName,
      tags: tags
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
      <Button variant="contained" onClick={handleSave}>Save</Button>
    </Box>
  );
};

export default ProjectDetails;
