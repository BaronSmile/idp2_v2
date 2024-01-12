import Tasks from '../../components/Tasks/Tasks.tsx';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../services/api.ts';
import { useAppSelector } from '../../providers/store';
import SearchInput from '../../components/SearchInput/SearchInput.tsx';
import FilterBtn from '../../components/FilterBtn/FilterBtn.tsx';

const MainPage = () => {
  const { page, searchValue, sort, sortTitle, completed } = useAppSelector(
    (state) => state.tasksReducer,
  );
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', page, searchValue, sort, sortTitle, completed],
    queryFn: () => getTasks(page, searchValue, sort, sortTitle, completed),
  });

  return (
    <div>
      <>
        <SearchInput />
        <h1>Список задач</h1>
        <FilterBtn btnText={['Все задачи', 'Активные задачи', 'Завершенные задачи']} />
        <Tasks searchValue={searchValue} isLoading={isLoading} dataList={data || []} />
      </>
    </div>
  );
};

export default MainPage;
