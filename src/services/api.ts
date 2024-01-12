import axios from 'axios';
import { ITask } from '../types.ts';

const urlBASE: string = 'https://64da687be947d30a260b3a0f.mockapi.io/tasks';
export const getTasks = async (
  page: number,
  searchValue: string,
  sort?: 'asc' | 'desc' | undefined,
  title?: string,
  completed?: boolean | null,
) => {
  let url = `${urlBASE}?page=${page}&title=${searchValue}&order=${sort}&sortBy=${
    sort === undefined ? 'id' : title
  }`;
  if (searchValue) {
    url += `&search=title`;
  } else if (completed !== null) {
    url += `&completed=${completed}`;
  }
  const response = await axios(url);

  let data = response.data;

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
};

export const completeTask = async (task: ITask) => {
  const res = await axios.put(`${urlBASE}/${task.id}`, { ...task, completed: !task.completed });
  return res.data;
};
