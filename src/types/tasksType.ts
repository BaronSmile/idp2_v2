export type ITask = {
  id?: number;
  title: string;
  description: string;
  point: number;
  level: string;
  dateCreate: number;
  completed?: boolean;
  itemsTask: any[];
};
