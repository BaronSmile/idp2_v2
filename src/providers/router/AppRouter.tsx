import { Route, Routes } from 'react-router-dom';
import MainPage from '../../pages/MainPage/MainPage.tsx';
import TaskPage from '../../pages/TaskPage/TaskPage.tsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/task/:id" element={<TaskPage />} />
    </Routes>
  );
};

export default AppRouter;
