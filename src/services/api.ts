import axios from 'axios';
import { ITask } from '../types/tasksType.ts';

const urlBASE: string = 'https://64da687be947d30a260b3a0f.mockapi.io/tasks';
const axiosInstance = axios.create({ baseURL: urlBASE });
export const getTasks = async (
  page: number,
  searchValue: string,
  sort?: 'asc' | 'desc' | undefined,
  title?: string,
  completed?: boolean | null,
) => {
  try {
    let url = `?page=${page}&title=${searchValue}&order=${sort}&sortBy=${
      sort === undefined ? 'id' : title
    }`;
    if (searchValue) {
      url += `&search=title`;
    } else if (completed !== undefined) {
      url += `&completed=${completed}`;
    }
    const response = await axiosInstance(url);

    let data = response.data;

    // и за не корректной сортировки на стороне сервера, сортировка выполнена на клиенте
    if (title === 'id' || sort === undefined) {
      data = data.sort((a: any, b: any) => (sort === 'desc' ? b.id - a.id : a.id - b.id));
    } else if (title === 'level') {
      data = data.sort((a: { level: string }, b: { level: string }) => {
        const levelOrder: { [key: string]: number } = {
          easy: 1,
          medium: 2,
          hard: 3,
        };
        const levelA = levelOrder[a.level as keyof typeof levelOrder] || 0;
        const levelB = levelOrder[b.level as keyof typeof levelOrder] || 0;

        return levelA === levelB
          ? a.level.localeCompare(b.level)
          : sort === 'desc'
            ? levelB - levelA
            : levelA - levelB;
      });
    }
    return data;
  } catch (error) {
    console.error('Ошибка при выполнении запроса getTasks:', error);
    throw error;
  }
};

export const createTask = async (task: ITask) => {
  return await axiosInstance.post('/', task);
};

export const updateTask = async (task: ITask) => {
  return (await axiosInstance.put(`/${task.id}`, task)).data;
};

export const deleteTask = async (id: number) => {
  return await axiosInstance.delete(`/${id}`);
};
