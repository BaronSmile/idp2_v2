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

  const handleUpdateTask = async (tasks: ITask[]) => {
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
      {
        await Promise.all(ids.map((id) => deleteTask(id)));
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
