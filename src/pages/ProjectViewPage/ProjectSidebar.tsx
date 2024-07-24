import React from 'react';
import { List, ListItem, ListItemText, ListSubheader, Button } from '@mui/material';

interface ProjectSidebarProps {
  projects: any[];
  tasks: any[];
  onFocusChange: (focus: 'project' | 'task') => void;
  onDescriptionChange: (description: string) => void;
  setProjectName: (name: string) => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ projects, tasks, onFocusChange, onDescriptionChange, setProjectName }) => {
  return (
    <div>
      <List subheader={<ListSubheader>Projects</ListSubheader>}>
        {projects.map((project: any) => (
          <ListItem 
            button 
            key={project.project_name} 
            onClick={() => { 
              onFocusChange('project'); 
              onDescriptionChange(project.project_description); 
              setProjectName(project.project_name);
            }}
          >
            <ListItemText primary={project.project_name} />
          </ListItem>
        ))}
      </List>
      <List subheader={<ListSubheader>Tasks</ListSubheader>}>
        <Button variant="contained" color="primary" style={{ margin: '10px' }}>Add Task</Button>
        {tasks.map((task: any) => (
          <ListItem 
            button 
            key={task.task_title} 
            onClick={() => { 
              onFocusChange('task'); 
              onDescriptionChange(task.task_title); 
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
