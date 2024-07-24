import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Container, Paper } from '@mui/material';
import ProjectSidebar from './ProjectSidebar';
import ProjectDetails from './ProjectDetails';
import TaskDetails from './TaskDetails';
import Split from 'react-split';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ProjectViewPage.css';

const mdParser = new MarkdownIt();

const ProjectViewPage: React.FC = () => {
  const { userName, groupName, projectName, taskName, setTaskName, setProjectName } = useAppContext();
  const [projectDetails, setProjectDetails] = useState<any>({});
  const [taskDetails, setTaskDetails] = useState<any[]>([]);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    fetchProjectDetails();
    fetchTaskDetails();
    fetchWorkers();
  }, [projectName]);

  useEffect(() => {
    if (!taskName || taskName === '') {
      setMarkdownContent(projectDetails.project_description || '');
    } else {
      const task = taskDetails.find(task => task.task_title === taskName);
      if (task) {
        setMarkdownContent(task.description);
      }
    }
  }, [projectDetails, taskDetails, taskName]);

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
    if (!taskName) {
      setMarkdownContent(data.project_description || '');
    }
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

  const handleSave = () => {
    alert('Save functionality not implemented yet.');
  };

  const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    setMarkdownContent(text);
  };

  const handleFocusChange = (taskTitle?: string) => {
    if (taskTitle) {
      setTaskName(taskTitle);
    } else {
      setTaskName('');
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
              value={markdownContent}
              style={{ height: '100%' }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
              config={{ view: { menu: true, md: true, html: false } }}
            />
          </Paper>
        </div>
        <div className="sidebar">
          {(!taskName || taskName === '') && (
            <ProjectDetails 
              projectDetails={projectDetails} 
              onSave={handleSave} 
            />
          )}
          {taskName && taskName !== '' && (
            <TaskDetails 
              taskDetails={taskDetails.find(task => task.task_title === taskName)} 
              onSave={handleSave}
              workers={workers}
            />
          )}
        </div>
      </Split>
    </Container>
  );
};

export default ProjectViewPage;
