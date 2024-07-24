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
  const [focusing, setFocusing] = useState<'project' | 'task' | null>(null);
  const [description, setDescription] = useState<string>('');
  const [markdownContent, setMarkdownContent] = useState<string>('');

  useEffect(() => {
    fetchProjectDetails();
    fetchTaskDetails();
  }, [projectName]);

  useEffect(() => {
    if (!taskName) {
      setFocusing('project');
      setDescription(projectDetails.project_description || '');
      setMarkdownContent(projectDetails.project_description || '');
    } else {
      const task = taskDetails.find(task => task.task_title === taskName);
      if (task) {
        setFocusing('task');
        setDescription(task.description);
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
      setDescription(data.project_description || '');
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

  const handleSave = () => {
    alert('Save functionality not implemented yet.');
  };

  const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    setMarkdownContent(text);
  };

  const handleFocusChange = (focus: 'project' | 'task', description: string, taskTitle?: string) => {
    setFocusing(focus);
    setDescription(description);
    setMarkdownContent(description);
    if (focus === 'task' && taskTitle) {
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
            onFocusChange={(focus, description, taskTitle) => {
              handleFocusChange(focus, description, taskTitle);
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
          {focusing === 'project' && (
            <ProjectDetails 
              projectDetails={projectDetails} 
              onSave={handleSave} 
            />
          )}
          {focusing === 'task' && (
            <TaskDetails 
              taskName={taskName}
              taskDetails={taskDetails.find(task => task.task_title === taskName)} 
              onSave={handleSave} 
            />
          )}
        </div>
      </Split>
    </Container>
  );
};

export default ProjectViewPage;
