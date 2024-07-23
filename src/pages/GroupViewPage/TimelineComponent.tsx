import React, { useEffect, forwardRef } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { Project } from './utils';
import { useAppContext } from '../../context/AppContext';

interface TimelineComponentProps {
  projects: Project[];
  setTimeline: (timeline: any) => void;
  navigate: any;
}

const TimelineComponent = forwardRef<HTMLDivElement, TimelineComponentProps>(({ projects, setTimeline, navigate }, ref) => {
  const { projectName } = useAppContext();

  useEffect(() => {
    if (ref && 'current' in ref && ref.current && projects.length) {
      const tasks = projects.flatMap(project => project.tasks);
      const groups = new DataSet([...new Set(tasks.map(task => task.worker_name))].map((worker, index) => ({
        id: index + 1,
        content: worker,
      })));

      const items = new DataSet(
        tasks.map(task => {
          return {
            id: task.task_title,
            group: [...new Set(tasks.map(t => t.worker_name))].indexOf(task.worker_name) + 1,
            content: task.task_title,
            start: task.start_date,
            end: task.end_date,
            className: `vis-item ${task.tag_color[0]}`, // Using the first color for the item
            projectName: task.project_name,
          };
        })
      );

      const timelineInstance = new Timeline(ref.current, items, groups, {
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
          const item = items.get(props.item);
          navigate(`/project/${encodeURIComponent(item.projectName || '')}`);
        } else {
          alert('Double-clicked on an empty space or axis.');
        }
      });

      setTimeline(timelineInstance);
    }
  }, [projects]);

  return <div ref={ref} style={{ height: '400px' }}></div>;
});

export default TimelineComponent;
