import Tasks from '../../components/Tasks/Tasks.tsx';
import { useAppSelector } from '../../providers/store';
import SearchInput from '../../components/SearchInput/SearchInput.tsx';
import FilterBtn from '../../components/FilterBtn/FilterBtn.tsx';
import { useGetTasks } from '../../services/queries.ts';
import ActionsBtn from '../../components/ActionsBtn/ActionsBtn.tsx';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import './MainPage.scss';
import AddModalForm from '../../components/AddModalForm/AddModalForm.tsx';
import { ITask } from '../../types/tasksType.ts';
import { useNavigate } from 'react-router-dom';

interface MainPageProps {
  updateAuthStatus: () => void;
}

const MainPage = ({ updateAuthStatus }: MainPageProps) => {
  const { page, searchValue, sort, sortTitle, completed, ids } = useAppSelector(
    (state) => state.tasksReducer,
  );

  const [username, setUsername] = useState<string | null>(null);
  const [addTaskForm, setAddTaskForm] = useState(false);

  const tasksQuery = useGetTasks(page, searchValue, sort, sortTitle, completed);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  const handlerAddTask = () => {
    setAddTaskForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setUsername(null);
    updateAuthStatus();
    navigate('/auth');
  };

  return (
    <div>
      <>
        <div className={'username_block'}>
          {username && <h3>Привет, {username}!</h3>}
          <Button onClick={handleLogout}>Выйти</Button>
        </div>
        <SearchInput />
        <h1>Список задач</h1>
        <FilterBtn />
        <div className={'actions_btn_wrapper'}>
          <Button
            type={'text'}
            icon={<PlusCircleOutlined />}
            className={'add_btn'}
            onClick={handlerAddTask}
          >
            Добавить
          </Button>
          {ids!.length > 1 && <ActionsBtn dataList={(tasksQuery.data as ITask) || []} ids={ids} />}
        </div>
        <AddModalForm modalOpen={addTaskForm} setModalOpen={setAddTaskForm} />
        <Tasks
          searchValue={searchValue}
          isLoading={tasksQuery.isLoading}
          dataList={(tasksQuery.data as ITask) || []}
          ids={ids}
          type={'tasks'}
        />
      </>
    </div>
  );
};

export default MainPage;
