import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Worker } from './utils';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newTask: { worker_name: string; task_title: string; start_date: string; end_date: string; description: string; project_name: string; tag_color: string[] }) => void;
  workers: Worker[];
  projectNames: string[];
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose, onSubmit, workers, projectNames }) => {
  const [worker_name, setWorkerName] = useState('');
  const [task_title, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start_date, setStartDate] = useState<Date | null>(null);
  const [end_date, setEndDate] = useState<Date | null>(null);
  const [project_name, setProjectName] = useState('');

  const formatDateTime = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 00:00:00`;
  };

  const handleSubmit = () => {
    if (worker_name && task_title && description && start_date && end_date && project_name) {
      // Adjust the end date to make it inclusive
      const adjustedEndDate = new Date(end_date);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);

      onSubmit({
        worker_name,
        task_title,
        start_date: formatDateTime(start_date),
        end_date: formatDateTime(adjustedEndDate),
        description,
        project_name,
        tag_color: ['#FF0000'], // Example color, this can be dynamically set
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Worker Name"
          value={worker_name}
          onChange={(e) => setWorkerName(e.target.value)}
          fullWidth
          margin="normal"
        >
          {workers.map((worker) => (
            <MenuItem key={worker.user_name} value={worker.user_name}>
              {worker.user_name} ({worker.user_email})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Task Name"
          value={task_title}
          onChange={(e) => setTaskTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Project Name"
          value={project_name}
          onChange={(e) => setProjectName(e.target.value)}
          fullWidth
          margin="normal"
        >
          {projectNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={start_date}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={end_date}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add Task</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;
