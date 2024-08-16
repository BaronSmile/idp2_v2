export type ITaskData = {
  id?: number;
  title: string;
  description: string;
  point: number;
  level: string;
  dateCreate: number;
  completed?: boolean;
  itemsTask: any[];
};

export type ITask = {
  data: ITaskData[];
  totalItems: number;
  currentPage: number;
};
