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

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newTask: { worker_name: string; task_title: string; start_date: string; end_date: string; description: string; project_name: string; tag_color: string[] }) => void;
  workers: string[];
  projectName: string;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose, onSubmit, workers, projectName }) => {
  const [worker, setWorker] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (worker && title && startDate && endDate) {
      onSubmit({
        worker_name: worker,
        task_title: title,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        description,
        project_name: projectName,
        tag_color: ['#FFCDD2'], // Example color, adjust as needed
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
          value={worker}
          onChange={(e) => setWorker(e.target.value)}
          fullWidth
          margin="normal"
        >
          {workers.map((worker) => (
            <MenuItem key={worker} value={worker}>
              {worker}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
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
