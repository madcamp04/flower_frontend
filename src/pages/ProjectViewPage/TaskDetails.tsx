import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TaskDetailsProps {
  taskDetails: any;
  onSave: (updatedTask: any) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ taskDetails, onSave }) => {
  const [taskTitle, setTaskTitle] = useState(taskDetails?.task_title || '');
  const [workerName, setWorkerName] = useState(taskDetails?.worker_name || '');
  const [startDate, setStartDate] = useState<Date | null>(new Date(taskDetails?.start_time) || null);
  const [endDate, setEndDate] = useState<Date | null>(new Date(taskDetails?.end_time) || null);

  useEffect(() => {
    if (taskDetails) {
      setTaskTitle(taskDetails.task_title);
      setWorkerName(taskDetails.worker_name);
      setStartDate(new Date(taskDetails.start_time));
      setEndDate(new Date(taskDetails.end_time));
    }
  }, [taskDetails]);

  const formatDateTime = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 00:00:00`;
  };

  const handleSave = () => {
    // Adjust the end date to make it inclusive
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
        tag_colors: taskDetails.tag_colors
      });
    }
  };

  return (
    <Box>
      <TextField
        label="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Worker Name"
        value={workerName}
        onChange={(e) => setWorkerName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)}
          slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)}
          slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
        />
      </LocalizationProvider>
      <Button variant="contained" onClick={handleSave}>Save</Button>
    </Box>
  );
};

export default TaskDetails;
