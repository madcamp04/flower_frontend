import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button } from '@mui/material';
import Header from './Header';
import TimelineComponent from './TimelineComponent';
import ViewButtons from './ViewButtons';
import AddTaskDialog from './AddTaskDialog';
import TagsSelector from './TagsSelector';
import { generateDummyData, Project, Task } from './utils';
import { useAppContext } from '../../context/AppContext';
import './GroupViewPage.css';

const GroupViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupName, setGroupName, groupOwner, setGroupOwner, userName } = useAppContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [timeline, setTimeline] = useState<any>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

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
      .then(() => {
        navigate('/login');
      })
      .catch(() => {
        navigate('/login');
      });
  };

  const handleTaskSubmit = (newTask: { worker_name: string; task_title: string; start_date: string; end_date: string; description: string; project_name: string; tag_color: string[] }) => {
    const updatedProjects = [...projects];
    const projectIndex = updatedProjects.findIndex(project => project.project_name === newTask.project_name);

    if (projectIndex >= 0) {
      const newTaskObject: Task = {
        task_title: newTask.task_title,
        start_date: new Date(newTask.start_date),
        end_date: new Date(newTask.end_date),
        worker_name: newTask.worker_name,
        description: newTask.description,
        project_name: newTask.project_name,
        tag_color: newTask.tag_color,
      };

      updatedProjects[projectIndex].tasks.push(newTaskObject);
      setProjects(updatedProjects);
    }
  };

  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));
  const projectNames = projects.map(project => project.project_name);

  return (
    <Container maxWidth="lg">
      <Header userName={userName} onLogout={handleLogout} />
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h4" align="center">Group: {groupName}</Typography>
        <Typography variant="h6" align="center">Owner: {groupOwner}</Typography>
        <Button onClick={() => setOpenAddTaskDialog(true)} variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Task
        </Button>
        <TagsSelector tags={allTags} activeTags={activeTags} setActiveTags={setActiveTags} />
        <ViewButtons timeline={timeline} />
        <TimelineComponent
          projects={projects}
          setTimeline={setTimeline}
          navigate={navigate}
          activeTags={activeTags}
        />
        <AddTaskDialog
          open={openAddTaskDialog}
          onClose={() => setOpenAddTaskDialog(false)}
          onSubmit={handleTaskSubmit}
          workers={[...new Set(projects.flatMap(project => project.tasks.map(task => task.worker_name)))]}
          projectNames={projectNames}
        />
      </Paper>
    </Container>
  );
};

export default GroupViewPage;
