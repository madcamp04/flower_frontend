import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Button } from '@mui/material';
import Header from './Header';
import TimelineComponent from './TimelineComponent';
import ViewButtons from './ViewButtons';
import AddTaskDialog from './AddTaskDialog';
import AddWorkerDialog from './AddWorkerDialog';
import AddProjectDialog from './AddProjectDialog';
import TagsSelector from './TagsSelector';
import { Task, Worker } from './utils';
import { useAppContext } from '../../context/AppContext';
import './GroupViewPage.css';

const GroupViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupName, groupOwner, userName } = useAppContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [openAddWorkerDialog, setOpenAddWorkerDialog] = useState(false);
  const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);
  const [timeline, setTimeline] = useState<any>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchTags();
    fetchWorkers();
    fetchTasks();
  }, [activeTags]);

  const fetchTags = async () => {
    const response = await fetch('/backend/api-group-view/tag-list', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
      }),
    });
    const data = await response.json();
    setAllTags(data.tags.map(tag => tag.tag_name));
  };

  const fetchWorkers = async () => {
    const response = await fetch('/backend/api-group-view/worker-list', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
      }),
    });
    const data = await response.json();
    setWorkers(data.workers);
  };

  const fetchTasks = async () => {
    const response = await fetch('/backend/api-group-view/task-list/by-tag-list', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        tags: activeTags,
      }),
    });
    const data = await response.json();
    setTasks(data.tasks.map((task: any) => ({
      task_title: task.task_title,
      start_date: new Date(task.start_time),
      end_date: new Date(task.end_time),
      worker_name: task.worker_name,
      description: task.description,
      project_name: task.project_name,
      tag_color: task.tag_colors,
    })));
  };

  const handleLogout = () => {
    fetch('/backend/api-login/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
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

  const handleTaskSubmit = async (newTask: { worker_name: string; task_title: string; start_date: string; end_date: string; description: string; project_name: string; tag_color: string[] }) => {
    // Call your backend API to add a task here
    console.log('Task submission not implemented');
    // After adding a task, re-fetch tasks to update the UI
    await fetchTasks();
  };

  const handleWorkerSubmit = async (newWorker: { user_name: string; user_email: string }) => {
    await fetch('/backend/api-group-view/add-worker', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        worker_user_name: newWorker.user_name,
      }),
    });
    await fetchWorkers(); // Re-fetch workers to update the UI
  };

  const handleProjectSubmit = async (newProject: { project_name: string; project_description: string; tags: string[] }) => {
    await fetch('/backend/api-group-view/add-project', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        project_name: newProject.project_name,
      }),
    });
    await fetchTags(); // Re-fetch tags since new tags might have been added
    await fetchTasks(); // Re-fetch tasks to update the UI
  };

  const projectNames = [...new Set(tasks.map(task => task.project_name))];

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
          tasks={tasks}
          workers={workers}
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
