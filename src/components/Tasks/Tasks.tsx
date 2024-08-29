import React, { useState } from 'react';
import { ITask, ITaskData } from '../../types/tasksType.ts';
import { Form, Table, TablePaginationConfig } from 'antd';
import { useAppDispatch } from '../../providers/store';
import {
  setIds,
  setPage,
  setSort,
  setSortTitle,
} from '../../providers/store/reducers/tasksSlice.ts';
import { useNavigate } from 'react-router-dom';
import './Tasks.scss';
import { useDeleteTask, useUpdateTask } from '../../services/mutations.ts';
import { getTaskColumns } from './Tasks.table.tsx';

interface ITasksProps {
  searchValue: string;
  isLoading?: boolean;
  totalCount?: number;
  dataList: ITask;
  ids?: number[];
  type?: string;
}

const Tasks: React.FC<ITasksProps> = ({ searchValue, isLoading, dataList, ids, type }) => {
  const dispatch = useAppDispatch();
  const [editingRow, setEditingRow] = useState<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const rowStyle = (record: ITaskData) => {
    return record.completed ? 'opacity_row' : 'row';
  };

  const handleCompletedTask = (record: ITaskData | ITaskData[]) => {
    if (record) {
      const taskIds = Array.isArray(record) ? record : [record];
      const newTasks = taskIds.map((task) => ({
        ...task,
        completed: !task.completed,
      }));
      updateTaskMutation.mutate(newTasks);
    }
  };

  const handleDeleteTask = async (id: number | number[]) => {
    const taskIds = Array.isArray(id) ? id : [id];
    await deleteTaskMutation.mutateAsync(taskIds);
  };

  const handleEditTask = (record: ITaskData) => {
    setEditingRow(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      point: record.point,
      level: record.level,
    });
  };

  const columns = getTaskColumns(
    searchValue,
    editingRow,
    handleEditTask,
    handleDeleteTask,
    handleCompletedTask,
    dispatch,
    navigate,
  );

  const handleTableChange = (_pagination: TablePaginationConfig, _filters: any, sorter: any) => {
    dispatch(setSortTitle(sorter.field));
    dispatch(
      sorter.order === 'ascend'
        ? setSort('asc')
        : sorter.order === 'descend'
          ? setSort('desc')
          : setSort(undefined),
    );
  };

  const onFinish = (values: ITaskData) => {
    const updatedTask: ITaskData = { ...values, id: editingRow };
    updateTaskMutation.mutate([updatedTask]);
    setEditingRow(null);
  };

  const rowSelection = {
    selectedRowKeys: ids,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      switch (type) {
        case 'tasks':
          dispatch(setIds(newSelectedRowKeys));
          break;
        default:
          break;
      }
    },
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Table
        rowKey={(record) => record.id || Date.now()}
        rowSelection={rowSelection}
        rowClassName={rowStyle}
        loading={isLoading}
        className="tasks_table"
        dataSource={dataList.data}
        columns={columns}
        onChange={handleTableChange}
        pagination={{
          pageSize: 5,
          current: dataList.currentPage,
          total: dataList.totalItems || 0,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} задач`,
          onChange: (page) => {
            dispatch(setPage(page));
          },
        }}
      />
    </Form>
  );
};

export default Tasks;
