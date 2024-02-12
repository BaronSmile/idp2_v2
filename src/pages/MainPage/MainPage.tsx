import Tasks from '../../components/Tasks/Tasks.tsx';
import { useAppSelector } from '../../providers/store';
import SearchInput from '../../components/SearchInput/SearchInput.tsx';
import FilterBtn from '../../components/FilterBtn/FilterBtn.tsx';
import { useGetTasks } from '../../services/queries.ts';
import ActionsBtn from '../../components/ActionsBtn/ActionsBtn.tsx';
import { Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import './MainPage.scss';
import { useState } from 'react';
import AddModalForm from '../../components/AddModalForm/AddModalForm.tsx';

const MainPage = () => {
  const { page, searchValue, sort, sortTitle, completed, ids } = useAppSelector(
    (state) => state.tasksReducer,
  );

  const [addTaskForm, setAddTaskForm] = useState(false);

  const tasksQuery = useGetTasks(page, searchValue, sort, sortTitle, completed);

  const handlerAddTask = () => {
    setAddTaskForm(true);
  };

  return (
    <div>
      <>
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
          {ids!.length > 1 && <ActionsBtn dataList={tasksQuery.data || []} ids={ids} />}
        </div>
        <AddModalForm modalOpen={addTaskForm} setModalOpen={setAddTaskForm} />
        <Tasks
          searchValue={searchValue}
          isLoading={tasksQuery.isLoading}
          dataList={tasksQuery.data || []}
          ids={ids}
          type={'tasks'}
        />
      </>
    </div>
  );
};

export default MainPage;
