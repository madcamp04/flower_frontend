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
  onSubmit: (newTask: { worker: string; title: string; startDate: string; endDate: string }) => void;
  workers: string[];
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose, onSubmit, workers }) => {
  const [worker, setWorker] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (worker && title && startDate && endDate) {
      onSubmit({
        worker,
        title,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            // renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            // renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
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
