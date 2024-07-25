import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Chip } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface ProjectDetailsProps {
  projectDetails: any;
  onSave: (updatedProject: any) => void;
  onDelete: () => void;  // Add this line
  existingTags: string[];
  isChanged: boolean;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectDetails, onSave, onDelete, existingTags, isChanged }) => {  // Add onDelete to the parameters
  const [projectName, setProjectName] = useState(projectDetails.project_name || '');
  const [tags, setTags] = useState<string[]>(projectDetails.tags || []);
  const [localIsChanged, setLocalIsChanged] = useState(false);

  useEffect(() => {
    setProjectName(projectDetails.project_name || '');
    setTags(projectDetails.tags || []);
    setLocalIsChanged(false);
  }, [projectDetails]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
    setLocalIsChanged(true);
  };

  const handleTagsChange = (event: any, newValue: string[]) => {
    setTags(newValue);
    setLocalIsChanged(true);
  };

  const handleSave = () => {
    onSave({
      project_name: projectName,
      tags: tags
    });
    setLocalIsChanged(false);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Box>
      <TextField
        label="Project Name"
        value={projectName}
        onChange={handleProjectNameChange}
        fullWidth
        margin="normal"
      />
      <Autocomplete
        multiple
        freeSolo
        options={existingTags}
        value={tags}
        onChange={handleTagsChange}
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
      <Box display="flex" justifyContent="space-between">
        <Button 
          variant="contained" 
          color="secondary"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave} 
          disabled={!isChanged && !localIsChanged}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectDetails;
