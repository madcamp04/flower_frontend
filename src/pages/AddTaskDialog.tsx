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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null, event?: React.SyntheticEvent<any> | undefined) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          customInput={<TextField label="Start Date" fullWidth margin="normal" />}
        />
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          customInput={<TextField label="End Date" fullWidth margin="normal" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">Add Task</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;