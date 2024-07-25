import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Container, Paper } from '@mui/material';
import ProjectSidebar from './ProjectSidebar';
import ProjectDetails from './ProjectDetails';
import TaskDetails from './TaskDetails';
import Split from 'react-split';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ProjectViewPage.css';
import DeleteProjectConfirmationDialog from './DeleteProjectConfirmationDialog'; // Import the dialog

const mdParser = new MarkdownIt();

const ProjectViewPage: React.FC = () => {
  const { userName, groupName, projectName, taskName, setTaskName, setProjectName } = useAppContext();
  const navigate = useNavigate(); // Use navigate hook for navigation
  const [projectDetails, setProjectDetails] = useState<any>({});
  const [taskDetails, setTaskDetails] = useState<any[]>([]);
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [workers, setWorkers] = useState<any[]>([]);
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog open state

  useEffect(() => {
    fetchProjectDetails();
    fetchTaskDetails();
    fetchWorkers();
    fetchTags();
  }, [projectName]);


  const fetchProjectDetails = async () => {
    const response = await fetch('/backend/api-project-view/project-detail', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: groupName,
        project_name: projectName,
      }),
    });
    const data = await response.json();
    setProjectDetails(data);
    setProjectDescription(data.project_description || '');
  };

  const fetchTaskDetails = async () => {
    const response = await fetch('/backend/api-group-view/task-list/by-project-name', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: groupName,
        project_name: projectName,
      }),
    });
    const data = await response.json();
    setTaskDetails(data.tasks);
  };

  const fetchWorkers = async () => {
    const response = await fetch('/backend/api-group-view/worker-list', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: groupName,
      }),
    });
    const data = await response.json();
    setWorkers(data.workers);
  };

  const fetchTags = async () => {
    const response = await fetch('/backend/api-group-view/tag-list', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: groupName,
      }),
    });
    const data = await response.json();
    setExistingTags(data.tags.map(tag => tag.tag_name));
  };

  const handleSave = async (updatedDetails: any) => {
    let response;
    // Use original project data if updatedDetails are null
    const newProjectName = updatedDetails.project_name || projectName;
    const newTags = updatedDetails.tags || projectDetails.tags;
  
    // Update project
    response = await fetch('/backend/api-project-view/update-project', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: groupName,
        project_name: projectName,
        new_project_name: newProjectName,
        new_project_descr: projectDescription,
        new_tags: newTags,
      }),
    });
    const project_data = await response.json();
    if (project_data.success) {
      setProjectName(newProjectName);
    } else {
      alert(`Save failed: ${project_data.message}`);
    }
  
    if (taskName && taskName !== '') {
      // Update task
      response = await fetch('/backend/api-project-view/update-task', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_user_name: userName,
          group_name: groupName,
          project_name: projectName,
          task_title: taskName,
          new_task_title: updatedDetails.task_title,
          new_worker_name: updatedDetails.worker_name,
          new_description: updatedDetails.taskDescription,
          new_start_time: updatedDetails.start_time,
          new_end_time: updatedDetails.end_time,
        }),
      });
  
      const task_data = await response.json();
      if (task_data.success) {
        setTaskName(updatedDetails.task_title);
      } else {
        alert(`Save failed: ${task_data.message}`);
      }
    }
  
    fetchProjectDetails();
    fetchTaskDetails();
    setIsChanged(false);
  };


  const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    setProjectDescription(text);
    setIsChanged(true);
  };

  const handleFocusChange = (taskTitle?: string) => {
    if (taskTitle) {
      setTaskName(taskTitle);
    } else {
      setTaskName('');
    }
  };

  const handleProjectDelete = async () => {
    setIsDialogOpen(true); // Open the dialog
  };

  const confirmDeleteProject = async () => {
    const response = await fetch('/backend/api-project-view/delete-project', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: groupName,
        project_name: projectName,
      }),
    });
    const data = await response.json();
    if (data.success) {
      alert('Project deleted successfully.');
      navigate('/group'); // Navigate back to group view page
    } else {
      alert(`Delete failed: ${data.message}`);
    }
  };

  const handleTaskDelete = async () => {
    const response = await fetch('/backend/api-project-view/delete-task', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner_user_name: userName,
        group_name: groupName,
        project_name: projectName,
        task_title: taskName,
      }),
    });
    const data = await response.json();
    if (data.success) {
      alert('Task deleted successfully.');
      setTaskName(''); // Clear the current task
      fetchTaskDetails(); // Refresh the task list
    } else {
      alert(`Delete failed: ${data.message}`);
    }
  };

  return (
    <Container maxWidth={false} className="container">
      <Split
        sizes={[20, 60, 20]}
        minSize={[200, 300, 200]}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        className="split-container"
      >
        <div className="sidebar">
          <ProjectSidebar 
            projects={[projectDetails]}
            tasks={taskDetails} 
            onFocusChange={(taskTitle) => {
              handleFocusChange(taskTitle);
            }} 
            setProjectName={setProjectName}
          />
        </div>
        <div>
          <Paper className="markdown-container">
            <MdEditor
              value={projectDescription}
              style={{ height: '100%' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              config={{ view: { menu: true, md: false, html: true }}}
            />
          </Paper>
        </div>
        <div className="sidebar">
          {(!taskName || taskName === '') && (
            <ProjectDetails 
              projectDetails={projectDetails} 
              onSave={(updatedDetails) => handleSave({ ...updatedDetails })} 
              onDelete={handleProjectDelete}  // Pass the handler
              existingTags={existingTags}
              isChanged={isChanged}
            />
          )}
          {taskName && taskName !== '' && (
            <TaskDetails 
              taskDetails={taskDetails.find(task => task.task_title === taskName)} 
              onSave={(updatedDetails) => handleSave({ ...updatedDetails })} 
              onDelete={handleTaskDelete}  // Pass the handler
              workers={workers}
              isChanged={isChanged}
            />
          )}
        </div>
      </Split>
      <DeleteProjectConfirmationDialog
        open={isDialogOpen}
        projectName={projectName}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={confirmDeleteProject}
      />
    </Container>
  );
};

export default ProjectViewPage;
