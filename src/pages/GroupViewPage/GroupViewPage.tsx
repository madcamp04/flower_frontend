import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Paper, Button, Typography } from '@mui/material';
import Header from './Header';
import TimelineComponent from './TimelineComponent';
import AddTaskDialog from './AddTaskDialog';
import AddWorkerDialog from './AddWorkerDialog';
import AddProjectDialog from './AddProjectDialog';
import AddTagDialog from './AddTagDialog';
import { Task, Worker, Project } from './utils';
import { useAppContext } from '../../context/AppContext';
import './GroupViewPage.css';
import { parse } from 'date-fns';

const GroupViewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupName, groupOwner, userName } = useAppContext();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [openAddWorkerDialog, setOpenAddWorkerDialog] = useState(false);
  const [openAddProjectDialog, setOpenAddProjectDialog] = useState(false);
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const [timeline, setTimeline] = useState<any>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
    fetchWorkers();
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [activeTags, activeProject]);

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
    const isValidProject = projects.some(project => project.project_name === activeProject);

    const url = isValidProject
      ? '/backend/api-group-view/task-list/by-project-name'
      : '/backend/api-group-view/task-list/by-tag-list';

    const body = isValidProject
      ? JSON.stringify({
          owner_user_name: groupOwner,
          group_name: groupName,
          project_name: activeProject,
        })
      : JSON.stringify({
          owner_user_name: groupOwner,
          group_name: groupName,
          tags: activeTags,
        });

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const data = await response.json();
    console.log('fetchTasks', data);
    console.log('start_data', data.tasks.map((task: any) => parse(task.start_time, 'yyyy-MM-dd HH:mm:ss.S', new Date())));
    setTasks(data.tasks.map((task: any) => ({
      task_title: task.task_title,
      start_date: parse(task.start_time, 'yyyy-MM-dd HH:mm:ss.S', new Date()),
      end_date: parse(task.end_time, 'yyyy-MM-dd HH:mm:ss.S', new Date()),
      worker_name: task.worker_name,
      description: task.description,
      project_name: task.project_name,
      tag_color: task.tag_colors,
    })));
  };

  const fetchProjects = async () => {
    const response = await fetch('/backend/api-group-view/project-list', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
      }),
    });
    const data = await response.json();
    setProjects(data.projects);
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
    console.log(groupOwner, groupName, newTask);
    const response = await fetch('/backend/api-project-view/add-task', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        project_name: newTask.project_name,
        worker_name: newTask.worker_name,
        task_title: newTask.task_title,
        description: newTask.description,
        start_time: newTask.start_date,
        end_time: newTask.end_date,
      }),
    });
  
    const data = await response.json();
    if (data.success) {
      await fetchTasks(); // Re-fetch tasks to update the UI
    } else {
      console.error(data.message);
    }
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
    await fetch('/backend/api-project-view/add-project', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        project_name: newProject.project_name,
        project_descr: newProject.project_description,
        tags: newProject.tags,
      }),
    });
    await fetchTags(); // Re-fetch tags since new tags might have been added
    await fetchProjects(); // Re-fetch projects to update the UI
    await fetchTasks(); // Re-fetch tasks to update the UI
  };

  const handleTagSubmit = async (newTag: { tag_name: string; tag_color: string }) => {
    await fetch('/backend/api-group-view/add-tag', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        tag_name: newTag.tag_name,
        tag_color: newTag.tag_color,
      }),
    });
    await fetchTags(); // Re-fetch tags since new tags might have been added
  };

  const projectNames = projects.map(project => project.project_name);

  // Handler to update activeProject
  const handleProjectChange = (event: any, value: string | null) => {
    setActiveProject(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f0f0'}}>
      <Header
        groupName={groupName}
        groupOwner={groupOwner}
        allTags={allTags}
        activeTags={activeTags}
        setActiveTags={setActiveTags}
        projectNames={projectNames}
        handleProjectChange={handleProjectChange}
        handleLogout={handleLogout}
        setOpenAddTaskDialog={setOpenAddTaskDialog}
        setOpenAddWorkerDialog={setOpenAddWorkerDialog}
        setOpenAddProjectDialog={setOpenAddProjectDialog}
        setOpenAddTagDialog={setOpenAddTagDialog}
      />
      <Box sx={{ height: '2px', backgroundColor: 'gray' }} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ width: '100%' }}>
          <TimelineComponent
            tasks={tasks}
            workers={workers}
            setTimeline={setTimeline}
            navigate={navigate}
            activeTags={activeTags}
          />
        </Box>
      </Box>
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
      <AddTagDialog
        open={openAddTagDialog}
        onClose={() => setOpenAddTagDialog(false)}
        onSubmit={handleTagSubmit}
      />
    </Box>
  );
};

export default GroupViewPage;
