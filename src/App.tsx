import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupSelectionPage from './pages/GroupSelectionPage';
import GroupViewPage from './pages/GroupViewPage/GroupViewPage';
import ProjectViewPage from './pages/ProjectViewPage/ProjectViewPage';
import { AppProvider, useAppContext } from './context/AppContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { setUserName, userName } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    console.log("ProtectedRoute useEffect");
    fetch('/backend/api-login/auto-login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setIsAuthenticated(true);
        setUserName(data.username); // Set user name in context
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    })
    .catch(() => {
      setIsAuthenticated(false);
      setIsLoading(false);
    });
  }, [setUserName]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <AppProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/group-selection"
            element={
              <ProtectedRoute>
                <GroupSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/group/:group_name"
            element={
              <ProtectedRoute>
                <GroupViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:projectName"
            element={
              <ProtectedRoute>
                <ProjectViewPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/group-selection" />} />
        </Routes>
      </LocalizationProvider>
    </AppProvider>
  );
};

export default App;
