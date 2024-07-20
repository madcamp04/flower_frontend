import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupSelectionPage from './pages/GroupSelectionPage';
import GroupViewPage from './pages/GroupViewPage';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = Cookies.get('authToken');
  const autoLogin = Cookies.get('autoLogin') === 'true';

  if (!authToken && !autoLogin) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  const navigate = useNavigate();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (!initialCheckDone) {
      const authToken = Cookies.get('authToken');
      const autoLogin = Cookies.get('autoLogin') === 'true';
      if (authToken || autoLogin) {
        navigate('/group-selection');
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
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;