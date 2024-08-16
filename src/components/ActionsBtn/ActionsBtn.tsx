import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import './ActionsBtn.scss';
import { useDeleteTask, useUpdateTask } from '../../services/mutations.ts';
import { setIds } from '../../providers/store/reducers/tasksSlice.ts';
import { useAppDispatch } from '../../providers/store';
import { ITask, ITaskData } from '../../types/tasksType.ts';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface IProps {
  ids?: number[];
  dataList?: ITask;
}

const { confirm } = Modal;

const ActionsBtn: React.FC<IProps> = ({ ids, dataList }) => {
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteTasksMutation = useDeleteTask();
  const completedTasksMutation = useUpdateTask();

  const dispatch = useAppDispatch();

  const texts = ['Удалить задачи', 'Завершить задачи'];

  const filteredTasks = dataList?.data.filter((task) => ids?.includes(task.id as number)) ?? [];
  const firstCompleted = dataList?.data.find((task) => task.id === ids?.[0])?.completed;

  useEffect(() => {
    if (filteredTasks && filteredTasks.length > 0) {
      const areAllCompleted = filteredTasks.every(
        (task) => filteredTasks[0].completed === task.completed,
      );
      setIsCompleted(areAllCompleted);
    }
  }, [ids]);

  const actionsHandler = (text: string) => {
    if (isCompleted) {
      const updatedList = dataList?.data
        .filter((task) => ids?.includes(task.id as number))
        .map((task) => ({
          ...task,
          completed: !task.completed,
        }));

      switch (text) {
        case 'Удалить задачи':
          confirm({
            title: 'Вы уверены, что хотите удалить задачи?',
            icon: <ExclamationCircleOutlined />,
            content: 'Задачи будут удалены безвозвратно',
            okText: 'Удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk() {
              deleteTasksMutation.mutate(ids as number[]);
              dispatch(setIds([]));
            },
            onCancel() {},
          });
          break;
        case 'Завершить задачи':
          completedTasksMutation.mutate(updatedList as ITaskData[]);
          dispatch(setIds([]));
          break;
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className={'actions_btn'}>
      <Modal
        open={isModalOpen}
        closable={false}
        footer={[<Button onClick={() => setIsModalOpen(false)}>OK</Button>]}
      >
        {`Выберите только ${firstCompleted ? 'завершенные' : 'активные'} задачи`}
      </Modal>

      {texts.map((text) => (
        <Button
          key={text}
          onClick={() => actionsHandler(text)}
          className={text === 'Завершить задачи' ? 'btn_completed' : 'btn_deleted'}
        >
          {text === 'Завершить задачи' && firstCompleted ? 'Активировать задачи' : text}
        </Button>
      ))}
    </div>
  );
};

export default ActionsBtn;
