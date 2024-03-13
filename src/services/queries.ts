import { getTask, getTasks } from './api.ts';
import { useQuery } from '@tanstack/react-query';

export const useGetTasks = (
  page: number,
  searchValue: string,
  sort: 'asc' | 'desc' | undefined,
  sortTitle: string | undefined,
  completed: boolean | undefined,
) => {
  return useQuery({
    queryKey: ['tasks', page, searchValue, sort, sortTitle, completed],
    queryFn: () => getTasks(page, searchValue, sort, sortTitle, completed),
    retryDelay: 1000,
  });
};

export const useGetTask = (id: number | undefined) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(id),
    retryDelay: 1000,
  });
};
