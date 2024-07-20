import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login';
import Register from './pages/Register';
import MainBusinessPage from './pages/MainBusinessPage';

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

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    const autoLogin = Cookies.get('autoLogin') === 'true';
    if (authToken || autoLogin) {
      navigate('/main');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <MainBusinessPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;