import Tasks from '../../components/Tasks/Tasks.tsx';
import { useAppSelector } from '../../providers/store';
import SearchInput from '../../components/SearchInput/SearchInput.tsx';
import FilterBtn from '../../components/FilterBtn/FilterBtn.tsx';
import { useGetTasks } from '../../services/queries.ts';

const MainPage = () => {
  const { page, searchValue, sort, sortTitle, completed } = useAppSelector(
    (state) => state.tasksReducer,
  );

  const tasksQuery = useGetTasks(page, searchValue, sort, sortTitle, completed);

  if (tasksQuery.isError) {
    return <div>Произошла ошибка</div>;
  }

  return (
    <div>
      <>
        <SearchInput />
        <h1>Список задач</h1>
        <FilterBtn btnText={['Все задачи', 'Активные задачи', 'Завершенные задачи']} />
        <Tasks
          searchValue={searchValue}
          isLoading={tasksQuery.isLoading}
          dataList={tasksQuery.data || []}
        />
      </>
    </div>
  );
};

export default MainPage;
