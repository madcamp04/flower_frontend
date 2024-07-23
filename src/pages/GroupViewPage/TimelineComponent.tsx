import React, { useEffect, useRef } from 'react';
import { DataSet, Timeline } from 'vis-timeline/standalone';
import moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import { Project, Worker } from './utils';

interface TimelineComponentProps {
  projects: Project[];
  workers: Worker[];
  setTimeline: (timeline: any) => void;
  navigate: any;
  activeTags: string[];
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ projects, workers, setTimeline, navigate, activeTags }) => {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const timelineInstanceRef = useRef<Timeline | null>(null);

  useEffect(() => {
    if (timelineRef.current && projects.length) {
      const tasks = projects.flatMap(project => project.tasks);

      const groups = new DataSet(
        workers.map((worker, index) => ({
          id: index + 1,
          content: worker.user_name,
        }))
      );

      const items = new DataSet(
        tasks.map(task => {
          const project = projects.find(project => project.project_name === task.project_name);
          return {
            id: task.task_title,
            group: workers.findIndex(worker => worker.user_name === task.worker_name) + 1,
            content: task.task_title,
            start: task.start_date,
            end: task.end_date,
            className: `vis-item`,
            projectName: project?.project_name,
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
            const project = projects.find(p => p.project_name === item.projectName);
            navigate(`/project/${encodeURIComponent(project?.project_name || '')}`, { state: { project } });
          } else {
            alert('Double-clicked on an empty space or axis.');
          }
        });

        setTimeline(timelineInstance);
        timelineInstanceRef.current = timelineInstance;
      }
    }
  }, [projects, workers, activeTags]);

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
