import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupSelectionPage from './pages/GroupSelectionPage';
import GroupViewPage from './pages/GroupViewPage';
import ProjectViewPage from './pages/ProjectViewPage';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const sessionId = Cookies.get('session_id');
  const autoLogin = Cookies.get('autoLogin') === 'true';

  if (!sessionId && !autoLogin) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const navigate = useNavigate();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    console.log("initialCheckDone: ", initialCheckDone);
    if (!initialCheckDone) {
      const sessionId = Cookies.get('session_id');
      const autoLogin = Cookies.get('autoLogin') === 'true';
      console.log("sessionId: ", sessionId);
      if (sessionId || autoLogin) {
        // Dummy auto-login logic
        const dummyResponse = { success: true };
        if (dummyResponse.success) {
          // Do not navigate here to avoid redirecting on refresh
        } else {
          navigate('/login');
        }

        // Backend call example (commented out)
        // fetch('https://your-backend-api.com/api-login/auto-login', {
        //   method: 'POST',
        //   credentials: 'include',
        //   headers: { 'Content-Type': 'application/json' }
        // }).then(response => response.json())
        //   .then(data => {
        //     if (data.success) {
        //       // Do not navigate here to avoid redirecting on refresh
        //     } else {
        //       navigate('/login');
        //     }
        //   });
      }
      setInitialCheckDone(true);
    }
  }, [navigate, initialCheckDone]);

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
      <Route path="/" element={<Navigate to={Cookies.get('session_id') || Cookies.get('autoLogin') === 'true' ? '/group-selection' : '/login'} />} />
    </Routes>
  );
};

export default App;