import { getTask, getTasks, getUser, getUserByToken } from './api.ts';
import { useQuery } from '@tanstack/react-query';

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
    queryFn: () => {
      if (!userId) {
        throw new Error('Пользователь не авторизован');
      }
      return getTasks(userId, page, searchValue, sort, sortTitle, completed);
    },
    retryDelay: 1000,
    enabled: !!userId,
  });
};

export const useGetTask = (id: number | undefined) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(id),
    retryDelay: 1000,
  });
};

export const useGetUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
    retryDelay: 1000,
    enabled: !!username,
  });
};

export const useGetUserByToken = (token: string | null) => {
  return useQuery<{
    success: boolean;
    user?: { userId: string; username: string };
    message?: string;
  }>({
    queryKey: ['user', 'token'],
    queryFn: () => getUserByToken(token as string),
    retryDelay: 1000,
    enabled: !!token,
  });
};
