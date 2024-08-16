import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ITask, ITaskData } from '../types/tasksType.ts';
import { createTask, deleteTask, login, register, updateTask } from './api';

interface DecodedToken {
  userId: string;
  username: string;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    return JSON.parse(atob(token));
  } catch (error) {
    console.error('Ошибка при декодировании токена:', error);
    return null;
  }
}

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Omit<ITask, 'id' | 'userId'>) => {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Пользователь не авторизован');
      }

      const decodedToken = decodeToken(token);

      if (!decodedToken || !decodedToken.userId) {
        throw new Error('Некорректный токен');
      }

      return createTask(decodedToken.userId, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Ошибка при создании задачи:', error);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const handleUpdateTask = async (tasks: ITaskData[]) => {
    await Promise.all(
      tasks.map(async (task) => {
        const { id, ...updatedValues } = task;
        await updateTask({ id, ...updatedValues });
      }),
    );
  };

  return useMutation({
    mutationFn: handleUpdateTask,
    retryDelay: 1000,
    onSettled: async (_, error, tasks) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
        tasks.forEach(async (task) => {
          await queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
        });
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      try {
        await Promise.all(ids.map((id) => deleteTask(id)));
      } catch (error) {
        console.error('Ошибка при удалении задач:', error);
        throw error;
      }
    },
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
    onSuccess: (data, { username }) => {
      if (data.success && data.token && data.userId) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      register(username, password),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    },
  });
};
