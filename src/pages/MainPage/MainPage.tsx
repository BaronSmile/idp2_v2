import Tasks from '../../components/Tasks/Tasks.tsx';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../../services/api.ts';
import { useAppSelector } from '../../providers/store';
import SearchInput from '../../components/SearchInput/SearchInput.tsx';

const MainPage = () => {
  const { page, searchValue, sort, sortTitle } = useAppSelector((state) => state.tasksReducer);
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', page, searchValue, sort, sortTitle],
    queryFn: () => getTasks(page, searchValue, sort, sortTitle),
  });

  return (
    <div>
      <>
        <SearchInput />
        <Tasks searchValue={searchValue} isLoading={isLoading} dataList={data || []} />
      </>
    </div>
  );
};

export default MainPage;
