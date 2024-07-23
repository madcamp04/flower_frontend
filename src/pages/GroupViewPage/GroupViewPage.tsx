import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';
import Header from './Header';
import TimelineComponent from './TimelineComponent';
import ViewButtons from './ViewButtons';
import AddTaskDialog from './AddTaskDialog';
import { generateDummyData, Project, Task } from './utils';
import './GroupViewPage.css';

interface LocationState {
  group_name?: string;
  owner_name?: string;
  user_name?: string;
}

const GroupViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { group_name = 'Unknown Group', owner_name = 'Unknown Owner', user_name = 'Unknown User' } = (location.state || {}) as LocationState;

  const [projects, setProjects] = useState<Project[]>([]);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timeline, setTimeline] = useState<any>(null);

  useEffect(() => {
    const generatedProjects = generateDummyData(5, 10);
    setProjects(generatedProjects);
  }, []);

  const handleLogout = () => {
    fetch('/backend/api-login/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => response.json())
      .then(data => {
        navigate('/login');
      })
      .catch(error => {
        navigate('/login');
      });
  };

  const handleTaskSubmit = (newTask: { worker: string; title: string; startDate: string; endDate: string }) => {
    const updatedProjects = [...projects];
    const projectId = updatedProjects[0].id;

    const newTaskObject: Task = {
      id: Math.max(...updatedProjects.flatMap(p => p.tasks.map(t => t.id))) + 1,
      worker: newTask.worker,
      title: newTask.title,
      startDate: new Date(newTask.startDate),
      endDate: new Date(newTask.endDate),
      projectId,
    };

    updatedProjects[0].tasks.push(newTaskObject);
    setProjects(updatedProjects);
  };

  return (
    <Container maxWidth="lg">
      <Header user_name={user_name} onLogout={handleLogout} />
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h4" align="center">Group: {group_name}</Typography>
        <Typography variant="h6" align="center">Owner: {owner_name}</Typography>
        <ViewButtons timeline={timeline} />
        <TimelineComponent ref={timelineRef} projects={projects} setTimeline={setTimeline} navigate={navigate} />
        <AddTaskDialog
          open={openAddTaskDialog}
          onClose={() => setOpenAddTaskDialog(false)}
          onSubmit={handleTaskSubmit}
          workers={[...new Set(projects.flatMap(project => project.tasks.map(task => task.worker)))]}
        />
      </Paper>
    </Container>
  );
};

export default GroupViewPage;
