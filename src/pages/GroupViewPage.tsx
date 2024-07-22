import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar, Button, Paper, ButtonGroup } from '@mui/material';
import { addDays, startOfWeek } from 'date-fns';
import { faker } from '@faker-js/faker';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import moment, { MomentInput } from 'moment';
import AddTaskDialog from './AddTaskDialog'; // Ensure this path is correct
import './GroupViewPage.css'; // Import the custom CSS

interface LocationState {
  group_name?: string;
  owner_name?: string;
  user_name?: string;
}

interface Task {
  id: number;
  worker: string;
  title: string;
  startDate: Date;
  endDate: Date;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
  tags: string[];
  color: string;
}

const generateDummyData = (numProjects: number, numTasksPerProject: number): Project[] => {
  const projects: Project[] = [];
  const workers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
  const colors = ['red', 'green', 'blue', 'orange', 'purple'];

  let taskIdCounter = 1; // Counter to ensure unique task IDs

  for (let i = 0; i < numProjects; i++) {
    const tasks: Task[] = [];
    const projectId = i + 1;

    for (let j = 0; j < numTasksPerProject; j++) {
      // Generate random dates
      let startDate = faker.date.between(startOfWeek(new Date()), addDays(new Date(), 7));
      startDate = new Date(startDate.setHours(0, 0, 0, 0)); // Set startDate to the start of the day

      let endDate = addDays(startDate, faker.datatype.number({ min: 1, max: 7 }));
      endDate = new Date(endDate.setHours(0, 0, 0, 0)); // Set endDate to the start of the day

      tasks.push({
        id: taskIdCounter++, // Ensure unique task IDs
        worker: workers[faker.datatype.number({ min: 0, max: workers.length - 1 })],
        title: faker.lorem.words(),
        startDate,
        endDate,
        projectId,
      });
    }

    projects.push({
      id: projectId,
      name: faker.company.name(),
      tasks,
      tags: [faker.lorem.word(), faker.lorem.word()],
      color: colors[i % colors.length],
    });
  }

  return projects;
};

const GroupViewPage = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    group_name = 'Unknown Group',
    owner_name = 'Unknown Owner',
    user_name = 'Unknown User',
  } = (location.state || {}) as LocationState;

  const [projects, setProjects] = useState<Project[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);

  useEffect(() => {
    const generatedProjects = generateDummyData(5, 10);
    setProjects(generatedProjects);
  }, []);

  useEffect(() => {
    if (timelineRef.current && projects.length) {
      const tasks = projects.flatMap(project => project.tasks);
      const groups = new DataSet(
        [...new Set(tasks.map(task => task.worker))].map((worker, index) => ({
          id: index + 1,
          content: worker,
        }))
      );

      const items = new DataSet(
        tasks.map(task => {
          const project = projects.find(project => project.id === task.projectId);
          return {
            id: task.id,
            group: [...new Set(tasks.map(t => t.worker))].indexOf(task.worker) + 1,
            content: task.title,
            start: task.startDate,
            end: task.endDate,
            className: `vis-item ${project?.color}`, // Apply the custom CSS class
            projectName: project?.name,
          };
        })
      );

      const timelineInstance = new Timeline(timelineRef.current, items, groups, {
        stack: true,
        editable: {
          add: false,         // add new items by double tapping
          updateTime: true,  // drag items horizontally
          updateGroup: true, // drag items from one group to another
          remove: true,       // delete an item by tapping the delete button top right
          overrideItems: false  // allow these options to override item.editable
        },
        margin: {
          item: 10,
          axis: 5,
        },
        orientation: { axis: 'top' },
        zoomable: false, // Disable zooming
        showWeekScale: true,
        locale: 'en',
        verticalScroll: true,
        snap: (date) => {
          return moment(date).startOf('day').toDate();
        }
      });

      // Set initial view to "week view"
      timelineInstance.setOptions({
        moment: (date: MomentInput) => moment(date as Date).utcOffset(9),
        start: moment().startOf('week').toDate(),
        end: moment().startOf('week').add(1, 'week').toDate(),
        timeAxis: { scale: 'day', step: 1 },
        showWeekScale: true,
      });

      timelineInstance.on('rangechange', (props) => {
        timelineInstance.setWindow(props.start, props.end, { animation: false });
      });

      timelineInstance.on('doubleClick', (props) => {
        if (props.item) {
          const item = items.get(props.item);
          const project = projects.find(p => p.name === item.projectName);
          navigate(`/project/${encodeURIComponent(project?.name || '')}`, { state: { project } });
        } else if (props.group) {
          const group = groups.get(props.group);
          console.log(group);
        } else {
          alert('Double-clicked on an empty space or axis.');
        }
      });

      setTimeline(timelineInstance);
    }
  }, [projects]);

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

  const handleViewChange = (view: string) => {
    if (timeline) {
      let start, end, timeAxis;
      switch (view) {
        case 'week':
          start = moment().startOf('week').toDate();
          end = moment().startOf('week').add(1, 'week').toDate();
          timeAxis = { scale: 'day', step: 1 };
          timeline.setOptions({ showWeekScale: true });
          break;
        case 'month':
          start = moment().startOf('month').toDate();
          end = moment().endOf('month').toDate();
          timeAxis = { scale: 'day', step: 7 }; // Show weeks within the month view
          timeline.setOptions({ showWeekScale: false });
          break;
        case 'quarter':
          start = moment().startOf('quarter').toDate();
          end = moment().endOf('quarter').toDate();
          timeAxis = { scale: 'month', step: 1 };
          timeline.setOptions({ showWeekScale: false });
          break;
        default:
          start = moment().startOf('week').toDate();
          end = moment().startOf('week').add(1, 'month').toDate();
          timeAxis = { scale: 'day', step: 1 };
          timeline.setOptions({ showWeekScale: true });
      }
      timeline.setOptions({ timeAxis });
      timeline.setWindow(start, end, { animation: false });
    }
  };
  const handleTaskSubmit = (newTask: { worker: string; title: string; startDate: string; endDate: string }) => {
    setProjects(prevProjects => {
      const updatedProjects = [...prevProjects];
      const projectIndex = updatedProjects.findIndex(project => project.tasks.some(task => task.worker === newTask.worker));
      if (projectIndex !== -1) {
        const newTaskId = updatedProjects[projectIndex].tasks.length + 1;
        updatedProjects[projectIndex].tasks.push({
          id: newTaskId,
          worker: newTask.worker,
          title: newTask.title,
          startDate: new Date(newTask.startDate),
          endDate: new Date(newTask.endDate),
          projectId: updatedProjects[projectIndex].id,
        });
      }
      return updatedProjects;
    });
  
    setAddTaskDialogOpen(false);
  };
  
  return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user_name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Group: {group_name}
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center">
          Owner: {owner_name}
        </Typography>
        <ButtonGroup variant="contained" color="primary" sx={{ mb: 2, justifyContent: 'center' }} fullWidth>
          <Button onClick={() => handleViewChange('week')}>Week View</Button>
          <Button onClick={() => handleViewChange('month')}>Month View</Button>
          <Button onClick={() => handleViewChange('quarter')}>Quarter View</Button>
        </ButtonGroup>
        <Button variant="contained" color="primary" onClick={() => setAddTaskDialogOpen(true)}>Add Task</Button>
        <div ref={timelineRef} style={{ height: '400px' }}></div>
      </Paper>
      <AddTaskDialog
        open={addTaskDialogOpen}
        onClose={() => setAddTaskDialogOpen(false)}
        onSubmit={handleTaskSubmit}
        workers={projects.flatMap(project => project.tasks.map(task => task.worker)).filter((value, index, self) => self.indexOf(value) === index)}
      />
    </Container>
  );
};

export default GroupViewPage;
