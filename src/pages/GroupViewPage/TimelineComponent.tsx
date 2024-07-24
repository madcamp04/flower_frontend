import React, { useEffect, useRef } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { Task, Worker } from './utils';
import { useAppContext } from '../../context/AppContext'; // Import the context

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

  const { setProjectName, setTaskName } = useAppContext(); // Use the context

  useEffect(() => {
    if (timelineRef.current) {
      const groups = new DataSet(
        workers.map((worker, index) => ({
          id: index + 1,
          content: worker.user_name,
        }))
      );
      console.log("rendering timeline");
      console.log("groups", groups);
      console.log(tasks, workers);

      const items = new DataSet(
        tasks.map(task => {
          const itemId = `${task.task_title}__SEP__${task.project_name}`; // Unique identifier
          console.log("task", task);
          console.log({
            id: itemId,
            group: workers.findIndex(worker => worker.user_name === task.worker_name) + 1,
            content: task.task_title, // Only display task_title
            start: task.start_date,
            end: task.end_date,
            className: `vis-item`,
            projectName: task.project_name,
          });
          return {
            id: itemId,
            group: workers.findIndex(worker => worker.user_name === task.worker_name) + 1,
            content: task.task_title,
            start: task.start_date,
            end: task.end_date,
            className: `vis-item`,
            projectName: task.project_name,
          };
        })
      );
      console.log("items", items);

      if (timelineInstanceRef.current) {
        console.log("updating timeline");
        timelineInstanceRef.current.setItems(items);
        timelineInstanceRef.current.setGroups(groups);
      } else {
        console.log("creating timeline");
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
        });

        timelineInstance.setOptions({
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
            console.log("props", props);
            console.log("items", items);
            console.log("props.item", props.item);
            const [task_title, project_name] = props.item.split('__SEP__');
            console.log("task_title:", task_title);
            console.log("project_name:", project_name);
            setTaskName(task_title); // Update taskName in context
            setProjectName(project_name); // Update projectName in context
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

  return <div ref={timelineRef} style={{ height: '400px' }}></div>;
};

export default TimelineComponent;