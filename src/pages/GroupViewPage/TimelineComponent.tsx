import React, { useEffect, useRef } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { Task, Worker } from './utils';
import { useAppContext } from '../../context/AppContext';
import { Button, Box } from '@mui/material';
import './TimelineComponent.css';

interface TimelineComponentProps {
  tasks: Task[];
  workers: Worker[];
  setTimeline: (timeline: any) => void;
  navigate: any;
  activeTags: string[];
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ tasks, workers, setTimeline, navigate, activeTags }) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineInstanceRef = useRef<Timeline | null>(null);

  const { setProjectName, setTaskName, groupName, groupOwner } = useAppContext();

  const fetchProjects = async () => {
    // Implement fetch projects logic
  };

  const fetchTasks = async () => {
    // Implement fetch tasks logic
  };

  const fetchWorkers = async () => {
    // Implement fetch workers logic
  };

  const formatDate = (date: Date) => {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  };

  const handleMove = async (item, callback) => {
    const { id, group, start, end } = item;
    const [taskTitle, projectName] = id.split('__SEP__');
    const newWorkerName = workers[group - 1].user_name;
    const task = tasks.find(t => t.task_title === taskTitle && t.project_name === projectName);
    if (!task) return;

    const response = await fetch('/backend/api-project-view/update-task', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        project_name: projectName,
        task_title: task.task_title,
        new_task_title: task.task_title,
        new_worker_name: newWorkerName,
        new_description: task.description,
        new_start_time: formatDate(new Date(start)),
        new_end_time: formatDate(new Date(end)),
      }),
    });

    const data = await response.json();
    if (data.success) {
      await fetchProjects();
      await fetchTasks();
      await fetchWorkers();
      callback(item);
    } else {
      console.error(data.message);
    }
  };

  const handleRemove = async (item, callback) => {
    const { id } = item;
    const [taskTitle, projectName] = id.split('__SEP__');

    const response = await fetch('/backend/api-project-view/delete-task', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_user_name: groupOwner,
        group_name: groupName,
        project_name: projectName,
        task_title: taskTitle,
      }),
    });

    const data = await response.json();
    if (data.success) {
      await fetchProjects();
      await fetchTasks();
      await fetchWorkers();
      callback(item);
    } else {
      console.error(data.message);
    }
  };

  const handleViewChange = (view: string) => {
    if (timelineInstanceRef.current) {
      let start, end, timeAxis;
      switch (view) {
        case 'week':
          start = moment().startOf('week').toDate();
          end = moment().startOf('week').add(1, 'week').toDate();
          timeAxis = { scale: 'day', step: 1 };
          timelineInstanceRef.current.setOptions({ showWeekScale: true });
          break;
        case 'month':
          start = moment().startOf('month').toDate();
          end = moment().endOf('month').toDate();
          timeAxis = { scale: 'day', step: 7 };
          timelineInstanceRef.current.setOptions({ showWeekScale: false });
          break;
        case 'quarter':
          start = moment().startOf('quarter').toDate();
          end = moment().endOf('quarter').toDate();
          timeAxis = { scale: 'month', step: 1 };
          timelineInstanceRef.current.setOptions({ showWeekScale: false });
          break;
        default:
          start = moment().startOf('week').toDate();
          end = moment().startOf('week').add(1, 'month').toDate();
          timeAxis = { scale: 'day', step: 1 };
          timelineInstanceRef.current.setOptions({ showWeekScale: true });
      }
      timelineInstanceRef.current.setOptions({ timeAxis });
      timelineInstanceRef.current.setWindow(start, end, { animation: false });
    }
  };

  useEffect(() => {
    if (timelineRef.current) {
      const groups = new DataSet(
        workers.map((worker, index) => ({
          id: index + 1,
          content: worker.user_name,
        }))
      );

      const items = new DataSet(
        tasks.map((task) => {
          const itemId = `${task.task_title}__SEP__${task.project_name}`;
          const gradient = 'linear-gradient(90deg, #03045e, #0077b6)';
          return {
            id: itemId,
            group: workers.findIndex(worker => worker.user_name === task.worker_name) + 1,
            content: task.task_title,
            start: task.start_date,
            end: task.end_date,
            className: `vis-item`,
            style: `background: ${gradient}; color: #FFFFFF; font-weight: 600; font-size: 14px;`,
            projectName: task.project_name,
          };
        })
      );

      if (timelineInstanceRef.current) {
        timelineInstanceRef.current.setItems(items);
        timelineInstanceRef.current.setGroups(groups);
      } else {
        const timelineInstance = new Timeline(timelineRef.current, items, groups, {
          stack: true,
          editable: { updateTime: true, updateGroup: true, remove: true },
          margin: { item: 10, axis: 5 },
          orientation: { axis: 'top' },
          zoomable: false,
          showWeekScale: true,
          locale: 'en',
          verticalScroll: true,
          snap: (date) => moment(date).startOf('day').toDate(),
          moment: (date: moment.MomentInput) => moment(date).utcOffset(9),
          groupOrder: 'content',
          onMove: (item, callback) => {
            handleMove(item, callback);
          },
          onRemove: (item, callback) => {
            handleRemove(item, callback);
          }
        });

        timelineInstance.setOptions({
          start: moment().startOf('week').toDate(),
          end: moment().startOf('week').add(1, 'week').toDate(),
          timeAxis: { scale: 'day', step: 1 },
          showWeekScale: true,
        });

        timelineInstance.on('doubleClick', (props) => {
          if (props.item) {
            const [task_title, project_name] = props.item.split('__SEP__');
            setTaskName(task_title);
            setProjectName(project_name);
            navigate(`/project`);
          } else {
            alert('Double-clicked on an empty space or axis.');
          }
        });

        setTimeline(timelineInstance);
        timelineInstanceRef.current = timelineInstance;
      }
    }
  }, [tasks, workers, activeTags]);

  useEffect(() => {
    return () => {
      if (timelineInstanceRef.current) {
        timelineInstanceRef.current.destroy();
        timelineInstanceRef.current = null;
      }
    };
  }, []);

  if (workers.length === 0) {
    return null;
  }

  return (
    <div className="timeline-container">
      <div ref={timelineRef} className="timeline-inner-container"></div>
      <Box className="button-container" display="flex" justifyContent="space-between">
        <Button
          size="small"
          onClick={() => handleViewChange('week')}
          variant="outlined"
          sx={{
            borderColor: 'black',
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
            }
          }}
        >
          Week
        </Button>
        <Button
          size="small"
          onClick={() => handleViewChange('month')}
          variant="outlined"
          sx={{
            borderColor: 'black',
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
            }
          }}
        >
          Month
        </Button>
        <Button
          size="small"
          onClick={() => handleViewChange('quarter')}
          variant="outlined"
          sx={{
            borderColor: 'black',
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
            }
          }}
        >
          Quarter
        </Button>
      </Box>
    </div>
  );
};

export default TimelineComponent;
