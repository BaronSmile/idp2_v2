import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ITask } from '../types/tasksType.ts';
import { createTask, deleteTask, updateTask } from './api';

export const useCreateTask = () => {
  return useMutation({
    mutationFn: (task: ITask) => createTask(task),
  });
};
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: ITask) => updateTask(task),
    retryDelay: 1000,
    onSettled: async (_, error, task) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
        await queryClient.invalidateQueries({ queryKey: ['tasks', task.id] });
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSettled: async (_, error) => {
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    },
  });
};
