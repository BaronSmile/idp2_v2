import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainPage from '../../pages/MainPage/MainPage.tsx';
import TaskPage from '../../pages/TaskPage/TaskPage.tsx';
import AuthPage from '../../pages/AuthorizationPage/Auth.tsx';
import PrivateRoute from '../../components/PrivateRoute/PrivateRoute.tsx';

const AppRouter = () => {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('token'));

  const updateAuthStatus = () => {
    setIsAuth(!!localStorage.getItem('token'));
  };

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          isAuth ? (
            <Navigate to="/tasks" replace />
          ) : (
            <AuthPage updateAuthStatus={updateAuthStatus} />
          )
        }
      />

      <Route element={<PrivateRoute isAuth={isAuth} />}>
        <Route path="/tasks" element={<MainPage updateAuthStatus={updateAuthStatus} />} />
        <Route path="/task/:id" element={<TaskPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuth ? '/tasks' : '/auth'} replace />} />
    </Routes>
  );
};

export default AppRouter;
