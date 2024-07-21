import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupSelectionPage from './pages/GroupSelectionPage';
import GroupViewPage from './pages/GroupViewPage';

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
        const dummyResponse = { success: true, session_id: sessionId || 'dummySessionId123' };
        if (dummyResponse.success && dummyResponse.session_id) {
          Cookies.set('session_id', dummyResponse.session_id, { expires: 7 });
        } else {
          navigate('/login');
        }

        // Backend call example (commented out)
        // fetch('https://your-backend-api.com/api/login/auto-login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ session_id: sessionId })
        // }).then(response => response.json())
        //   .then(data => {
        //     if (data.success) {
        //       Cookies.set('session_id', data.session_id, { expires: 7 });
        //       navigate('/group-selection');
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
      <Route path="/" element={<Navigate to={Cookies.get('session_id') || Cookies.get('autoLogin') === 'true' ? '/group-selection' : '/login'} />} />
    </Routes>
  );
};

export default App;