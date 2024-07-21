import React, { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Container, Typography, AppBar, Toolbar, Button, Paper } from '@mui/material';
import { addDays, startOfWeek, format } from 'date-fns';
import { faker } from '@faker-js/faker';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import moment, { MomentInput } from 'moment';

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
}

const generateDummyData = (numTasks: number): Task[] => {
  const tasks: Task[] = [];
  const workers = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];

  for (let i = 0; i < numTasks; i++) {
    const startDate = faker.date.between(startOfWeek(new Date()), addDays(new Date(), 7));
    const endDate = addDays(startDate, faker.datatype.number({ min: 1, max: 7 }));
    tasks.push({
      id: i + 1,
      worker: workers[faker.datatype.number({ min: 0, max: workers.length - 1 })],
      title: faker.lorem.words(),
      startDate,
      endDate,
    });
  }

  return tasks;
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

  const [tasks, setTasks] = useState<Task[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sessionId = Cookies.get('session_id');
    console.log("sessionId: ", sessionId);
    if (!sessionId) {
      navigate('/login');
    } else {
      const generatedTasks = generateDummyData(10);
      setTasks(generatedTasks);
    }
  }, [navigate]);

  useEffect(() => {
    if (timelineRef.current && tasks.length) {
      const groups = new DataSet(
        [...new Set(tasks.map(task => task.worker))].map((worker, index) => ({
          id: index + 1,
          content: worker,
        }))
      );

      const items = new DataSet(
        tasks.map(task => ({
          id: task.id,
          group: [...new Set(tasks.map(t => t.worker))].indexOf(task.worker) + 1,
          content: task.title,
          start: task.startDate,
          end: task.endDate,
        }))
      );

      const timeline = new Timeline(timelineRef.current, items, groups, {
        stack: true,
        editable: true,
        margin: {
          item: 10,
          axis: 5,
        },
        orientation: { axis: 'both' },
        zoomMin: 1000 * 60 * 60 * 24, // one day in milliseconds
        zoomMax: 1000 * 60 * 60 * 24 * 30, // one month in milliseconds
      });

      timeline.setOptions({
        moment: (date: MomentInput) => moment(date as Date).utcOffset(0),
        start: moment().startOf('week').toDate(),
        end: moment().startOf('week').add(1, 'month').toDate(),
        timeAxis: { scale: 'day', step: 1 },
      });

      timeline.on('rangechange', (props) => {
        timeline.setWindow(props.start, props.end, { animation: false });
      });
      timeline.on('click', (props) => {
        console.log("click");
        console.log(props);
      });
      timeline.on('doubleClick', (props) => {
        console.log("doubleClick");
        console.log(props);
      });
    }
  }, [tasks]);

  const handleLogout = () => {
    Cookies.remove('session_id');
    Cookies.remove('autoLogin');
    Cookies.remove('userName');
    navigate('/login');
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
        <div ref={timelineRef} style={{ height: '400px' }}></div>
      </Paper>
    </Container>
  );
};

export default GroupViewPage;