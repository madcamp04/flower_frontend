import React from 'react';
import { TextField, Button, Box } from '@mui/material';

interface TaskDetailsProps {
  taskDetails: any;
  onSave: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskDetails, onSave }) => {
  return (
    <Box>
      <TextField
        label="Task Title"
        value={taskDetails?.task_title || ''}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Worker Name"
        value={taskDetails?.worker_name || ''}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Start Time"
        value={taskDetails?.start_time || ''}
        fullWidth
        margin="normal"
      />
      <TextField
        label="End Time"
        value={taskDetails?.end_time || ''}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={onSave}>Save</Button>
    </Box>
  );
};

export default TaskDetails;
