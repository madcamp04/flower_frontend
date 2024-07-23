import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button } from '@mui/material';
import Header from './Header';
import TimelineComponent from './TimelineComponent';
import ViewButtons from './ViewButtons';
import AddTaskDialog from './AddTaskDialog';
import AddWorkerDialog from './AddWorkerDialog';
import AddProjectDialog from './AddProjectDialog'; // Import the new component
import TagsSelector from './TagsSelector';
import { generateDummyData, Project, Task, Worker } from './utils';
import { useAppContext } from '../../context/AppContext';
import './GroupViewPage.css';

const GroupViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupName, setGroupName, groupOwner, setGroupOwner, userName } = useAppContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [openAddWorkerDialog, setOpenAddWorkerDialog] = useState(false);
  const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false); // State for AddProjectDialog
  const [timeline, setTimeline] = useState<any>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    const { projects, workers } = generateDummyData(5, 10);
    setProjects(projects);
    setWorkers(workers);
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

  const handleWorkerSubmit = (newWorker: { user_name: string; user_email: string }) => {
    setWorkers(prevWorkers => [...prevWorkers, newWorker]);
  };

  const handleProjectSubmit = (newProject: Project) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
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
        <Button onClick={() => setOpenAddWorkerDialog(true)} variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
          Add Worker
        </Button>
        <Button onClick={() => setOpenAddProjectDialog(true)} variant="contained" sx={{ mt: 2, ml: 2, backgroundColor: '#388e3c', color: 'white' }}>
          Add Project
        </Button>
        <TagsSelector tags={allTags} activeTags={activeTags} setActiveTags={setActiveTags} />
        <ViewButtons timeline={timeline} />
        <TimelineComponent
          projects={projects}
          workers={workers} // Pass workers to the TimelineComponent
          setTimeline={setTimeline}
          navigate={navigate}
          activeTags={activeTags}
        />
        <AddTaskDialog
          open={openAddTaskDialog}
          onClose={() => setOpenAddTaskDialog(false)}
          onSubmit={handleTaskSubmit}
          workers={workers}
          projectNames={projectNames}
        />
        <AddWorkerDialog
          open={openAddWorkerDialog}
          onClose={() => setOpenAddWorkerDialog(false)}
          onSubmit={handleWorkerSubmit}
        />
        <AddProjectDialog
          open={openAddProjectDialog}
          onClose={() => setOpenAddProjectDialog(false)}
          onSubmit={handleProjectSubmit}
          existingTags={allTags}
        />
      </Paper>
    </Container>
  );
};

export default GroupViewPage;
