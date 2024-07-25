import React from 'react';
import { List, ListItem, ListItemText, ListSubheader, Button } from '@mui/material';

interface ProjectSidebarProps {
  projects: any[];
  tasks: any[];
  onFocusChange: (taskTitle?: string) => void;
  setProjectName: (name: string) => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ projects, tasks, onFocusChange, setProjectName }) => {
  return (
    <div>
      <List subheader={<ListSubheader>Projects</ListSubheader>}>
        {projects.map((project: any, index: number) => (
          <ListItem 
            button 
            key={project.project_name || `project-${index}`} 
            onClick={() => { 
              onFocusChange(); 
              setProjectName(project.project_name);
            }}
          >
            <ListItemText primary={project.project_name} />
          </ListItem>
        ))}
      </List>
      <List subheader={<ListSubheader>Tasks</ListSubheader>}>
        {tasks.map((task: any, index: number) => (
          <ListItem 
            button 
            key={task.task_title || `task-${index}`} 
            onClick={() => { 
              onFocusChange(task.task_title); 
            }}
          >
            <ListItemText primary={task.task_title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ProjectSidebar;
