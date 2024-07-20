import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login';
import Register from './pages/Register';
import MainBusinessPage from './pages/MainBusinessPage';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authToken = Cookies.get('authToken');
  const autoLogin = Cookies.get('autoLogin') === 'true';
  const location = useLocation();

  if (!authToken && !autoLogin) {
    // Redirect to login page, but save the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

const App = () => {
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
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;