import React, { useEffect, forwardRef } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { Project } from './utils';

interface TimelineComponentProps {
  projects: Project[];
  setTimeline: (timeline: any) => void;
  navigate: any;
}

const TimelineComponent = forwardRef<HTMLDivElement, TimelineComponentProps>(({ projects, setTimeline, navigate }, ref) => {
  useEffect(() => {
    if (ref && 'current' in ref && ref.current && projects.length) {
      const tasks = projects.flatMap(project => project.tasks);
      const groups = new DataSet([...new Set(tasks.map(task => task.worker))].map((worker, index) => ({
        id: index + 1,
        content: worker,
      })));

      const items = new DataSet(
        tasks.map(task => {
          const project = projects.find(project => project.id === task.projectId);
          return {
            id: task.id,
            group: [...new Set(tasks.map(t => t.worker))].indexOf(task.worker) + 1,
            content: task.title,
            start: task.startDate,
            end: task.endDate,
            className: `vis-item ${project?.color}`,
            projectName: project?.name,
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
          const project = projects.find(p => p.name === item.projectName);
          navigate(`/project/${encodeURIComponent(project?.name || '')}`, { state: { project } });
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
