import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Typography, AppBar, Toolbar, Button, Paper, ButtonGroup } from '@mui/material';
import { addDays, startOfWeek, format } from 'date-fns';
import { faker } from '@faker-js/faker';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import moment, { MomentInput } from 'moment';
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
      const startDate = faker.date.between(startOfWeek(new Date()), addDays(new Date(), 7));
      const endDate = addDays(startDate, faker.datatype.number({ min: 1, max: 7 }));
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
    user_name = Cookies.get('userName') || 'Unknown User',
  } = (location.state || {}) as LocationState;

  const [projects, setProjects] = useState<Project[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [timeline, setTimeline] = useState<any>(null);

  useEffect(() => {
    const sessionId = Cookies.get('session_id');
    if (!sessionId) {
      navigate('/login');
    } else {
      const generatedProjects = generateDummyData(5, 10);
      setProjects(generatedProjects);
    }
  }, [navigate]);

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
        orientation: { axis: 'both' },
        zoomable: false, // Disable zooming
        showWeekScale: true,
        locale: 'en',
        verticalScroll: true,
      });

      timelineInstance.setOptions({
        moment: (date: MomentInput) => moment(date as Date).utcOffset(0),
        start: moment().startOf('week').toDate(),
        end: moment().startOf('week').add(1, 'month').toDate(),
        timeAxis: { scale: 'day', step: 1 },
      });

      timelineInstance.on('rangechange', (props) => {
        timelineInstance.setWindow(props.start, props.end, { animation: false });
      });

      timelineInstance.on('doubleClick', (props) => {
        if (props.item) {
          const item = items.get(props.item);
          console.log(item);
          // alert(`Task: ${item.content}\nStart: ${format(new Date(item.start), 'MMM d, yyyy')}\nEnd: ${format(new Date(item.end), 'MMM d, yyyy')}`);
        } else if (props.group) {
          const group = groups.get(props.group);
          console.log(group);
          // alert(`Group: ${group.content}`);
        } else {
          alert('Double-clicked on an empty space or axis.');
        }
      });

      setTimeline(timelineInstance);
    }
  }, [projects]);

  const handleLogout = () => {
    Cookies.remove('session_id');
    Cookies.remove('autoLogin');
    Cookies.remove('userName');
    navigate('/login');
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
        <div ref={timelineRef} style={{ height: '400px' }}></div>
      </Paper>
    </Container>
  );
};

export default GroupViewPage;