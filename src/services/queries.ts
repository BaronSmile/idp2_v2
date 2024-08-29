import { getTask, getTasks } from './api.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useGetTasks = (
  page: number,
  searchValue: string,
  sort: 'asc' | 'desc' | undefined,
  sortTitle: string | undefined,
  completed: boolean | undefined,
) => {
  const token = localStorage.getItem('token');
  const decodedToken = token ? JSON.parse(atob(token)) : null;
  const userId = decodedToken?.userId;

  return useQuery({
    queryKey: ['tasks', userId, page, searchValue, sort, sortTitle, completed],
    queryFn: async () => {
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }
      const totalTasksResponse = await getTasks(userId, 1, '', undefined, undefined, undefined);
      const totalTasks = totalTasksResponse.totalItems;
      try {
        const result = await getTasks(userId, page, searchValue, sort, sortTitle, completed);

        return { ...result, totalTasks };
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          return { data: [], totalItems: 0, currentPage: 1, totalTasks };
        }
        throw error;
      }
    },
    retry: 1,
    placeholderData: keepPreviousData,
  });
};

export const useGetTask = (id: number | undefined) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(id),
    retryDelay: 1000,
  });
};
