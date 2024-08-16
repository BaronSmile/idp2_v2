import axios from 'axios';
import { ITask, ITaskData } from '../types/tasksType.ts';
import { v4 as uuidv4 } from 'uuid';

const urlBASE: string = 'https://64da687be947d30a260b3a0f.mockapi.io';
const tasksUrl: string = `${urlBASE}/tasks`;
const usersUrl: string = `${urlBASE}/users`;

const taskAxiosInstance = axios.create({ baseURL: tasksUrl });
const userAxiosInstance = axios.create({ baseURL: usersUrl });

taskAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getTasks = async (
  userId: string,
  page: number,
  searchValue: string,
  sort?: 'asc' | 'desc' | undefined,
  title?: string,
  completed?: boolean | null,
) => {
  let url = `?userId=${userId}&page=${page}&limit=5&title=${searchValue}&order=${sort}&sortBy=${
    sort === undefined ? 'id' : title
  }`;
  if (searchValue) {
    url += `&search=title`;
  } else if (completed !== undefined) {
    url += `&completed=${completed}`;
  }
  const response = await taskAxiosInstance(url);

  let data = response.data;
  const totalItems = await taskAxiosInstance('?limit=0');

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
  return { data, totalItems: totalItems.data.length, currentPage: page };
};

export const getTask = async (id: number | undefined) => {
  return (await taskAxiosInstance.get(`/${id}`)).data;
};

export const createTask = async (userId: string, task: Omit<ITask, 'id' | 'userId'>) => {
  return await taskAxiosInstance.post('/', { ...task, userId });
};

export const updateTask = async (task: ITaskData) => {
  return (await taskAxiosInstance.put(`/${task.id}`, task)).data;
};

export const deleteTask = async (id: number) => {
  return await taskAxiosInstance.delete(`/${id}`);
};

// Функция для простого "хеширования" пароля
function hashPassword(password: string, salt: string): string {
  return btoa(password + salt);
}

export const login = async (
  username: string,
  password: string,
): Promise<{ success: boolean; token?: string; userId?: string; message?: string }> => {
  try {
    const response = await userAxiosInstance.get(`/?username=${username}`);
    const user = response.data[0];

    if (user && hashPassword(password, user.salt) === user.passwordHash) {
      const token = btoa(JSON.stringify({ userId: user.userId, username: user.username }));
      return { success: true, token, userId: user.userId };
    } else {
      return { success: false, message: 'Неверное имя пользователя или пароль' };
    }
  } catch (error) {
    console.error('Ошибка при входе:', error);
    return { success: false, message: 'Произошла ошибка при попытке входа' };
  }
};

export const register = async (username: string, password: string) => {
  try {
    const salt = uuidv4();
    const passwordHash = hashPassword(password, salt);
    const userId = uuidv4();

    const response = await userAxiosInstance.post('/', {
      username,
      passwordHash,
      salt,
      userId,
    });

    return { success: true, user: response.data };
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return { success: false, message: 'Произошла ошибка при регистрации' };
  }
};

export const getUser = async (username: string) => {
  return (await userAxiosInstance.get(`/?username=${username}`)).data;
};

export const getUserByToken = async (token: string) => {
  try {
    const { userId } = JSON.parse(atob(token));
    const response = await userAxiosInstance.get(`/?userId=${userId}`);
    const user = response.data[0];
    if (user) {
      return { success: true, user: { userId: user.userId, username: user.username } };
    } else {
      return { success: false, message: 'Пользователь не найден' };
    }
  } catch (error) {
    console.error('Ошибка при получении пользователя по токену:', error);
    return { success: false, message: 'Недействительный токен' };
  }
};
