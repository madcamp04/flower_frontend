import React from 'react';
import { List, ListItem, ListItemText, ListSubheader, Button } from '@mui/material';

interface ProjectSidebarProps {
  projects: any[];
  tasks: any[];
  onFocusChange: (focus: 'project' | 'task', description: string, taskTitle?: string) => void;
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
              onFocusChange('project', project.project_description); 
              setProjectName(project.project_name);
            }}
          >
            <ListItemText primary={project.project_name} />
          </ListItem>
        ))}
      </List>
      <List subheader={<ListSubheader>Tasks</ListSubheader>}>
        <Button variant="contained" color="primary" style={{ margin: '10px' }}>Add Task</Button>
        {tasks.map((task: any, index: number) => (
          <ListItem 
            button 
            key={task.task_title || `task-${index}`} 
            onClick={() => { 
              onFocusChange('task', task.description, task.task_title); 
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
