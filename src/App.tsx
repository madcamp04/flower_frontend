import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupSelectionPage from './pages/GroupSelectionPage';
import GroupViewPage from './pages/GroupViewPage';
import ProjectViewPage from './pages/ProjectViewPage';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/backend/api-login/auto-login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })
    .then(response => {
      console.log("Auto-login raw response:", response);
      return response.json();
    })
    .then(data => {
      console.log("Auto-login response:", data);
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Auto-login error:", error);
      setIsAuthenticated(false);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
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
        path="/group/:group_id"
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
  );
};

export default App;