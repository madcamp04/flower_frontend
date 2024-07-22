import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, List, ListItem, ListItemText, AppBar, Toolbar, Button } from '@mui/material';

interface Task {
  id: number;
  worker: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
  tags: string[];
  color: string;
}

interface LocationState {
  project: Project;
}

const ProjectViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project } = location.state as LocationState;

  const handleLogout = () => {
    fetch('/backend/api-login/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        navigate('/login');
      } else {
        console.error('Logout failed:', data.message);
        navigate('/login');
      }
    })
    .catch(error => {
      console.error('Logout error:', error);
      navigate('/login');
    });
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project: {project.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Project: {project.name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center">
          Tasks
        </Typography>
        <List>
          {project.tasks.map(task => (
            <ListItem key={task.id}>
              <ListItemText
                primary={task.title}
                secondary={`Worker: ${task.worker} | Start: ${task.startDate.toLocaleDateString()} | End: ${task.endDate.toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default ProjectViewPage;