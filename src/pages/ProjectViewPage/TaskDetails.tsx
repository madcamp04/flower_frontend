import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse } from 'date-fns';

interface TaskDetailsProps {
  taskDetails: any;
  onSave: (updatedTask: any) => void;
  workers: { user_name: string; user_email: string; }[];
  isChanged: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskDetails, onSave, workers, isChanged }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [localIsChanged, setLocalIsChanged] = useState(false);

  useEffect(() => {
    if (taskDetails) {
      setTaskTitle(taskDetails.task_title || '');
      setWorkerName(taskDetails.worker_name || '');
      setStartDate(taskDetails.start_time ? parse(taskDetails.start_time, 'yyyy-MM-dd HH:mm:ss.S', new Date()) : null);
      setEndDate(taskDetails.end_time ? parse(taskDetails.end_time, 'yyyy-MM-dd HH:mm:ss.S', new Date()) : null);
      setLocalIsChanged(false);
    }
  }, [taskDetails]);

  const formatDateTime = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 00:00:00`;
  };

  const handleSave = () => {
    if (startDate && endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
      onSave({
        task_title: taskTitle,
        worker_name: workerName,
        start_time: formatDateTime(startDate),
        end_time: formatDateTime(adjustedEndDate),
        description: taskDetails.description,
        project_name: taskDetails.project_name,
        tag_colors: taskDetails.tag_colors,
      });
      setLocalIsChanged(false);
    }
  };

  return (
    <Box>
      <TextField
        label="Task Title"
        value={taskTitle}
        onChange={(e) => {
          setTaskTitle(e.target.value);
          setLocalIsChanged(true);
        }}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Worker Name"
        value={workerName}
        onChange={(e) => {
          setWorkerName(e.target.value);
          setLocalIsChanged(true);
        }}
        fullWidth
        margin="normal"
      >
        {workers.map((worker) => (
          <MenuItem key={worker.user_name} value={worker.user_name}>
            {worker.user_name} ({worker.user_email})
          </MenuItem>
        ))}
      </TextField>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            setLocalIsChanged(true);
          }}
          slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            setLocalIsChanged(true);
          }}
          slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
        />
      </LocalizationProvider>
      <Button 
        variant="contained" 
        onClick={handleSave} 
        disabled={!isChanged && !localIsChanged}
      >
        Save
      </Button>
    </Box>
  );
};

export default TaskDetails;
