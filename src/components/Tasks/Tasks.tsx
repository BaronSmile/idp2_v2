import React, { useState } from 'react';
import Highlighter from 'react-highlight-words';
import { ITask, ITaskData } from '../../types/tasksType.ts';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Table, TablePaginationConfig } from 'antd';
import { useAppDispatch } from '../../providers/store';
import {
  setId,
  setIds,
  setPage,
  setSort,
  setSortTitle,
} from '../../providers/store/reducers/tasksSlice.ts';
import { useNavigate } from 'react-router-dom';
import './Tasks.scss';
import { useDeleteTask, useUpdateTask } from '../../services/mutations.ts';

interface ITasksProps {
  searchValue: string;
  isLoading?: boolean;
  totalCount?: number;
  dataList: ITask;
  ids?: number[];
  type?: string;
}

const { Option } = Select;
const { confirm } = Modal;

const Tasks: React.FC<ITasksProps> = ({ searchValue, isLoading, dataList, ids, type }) => {
  const dispatch = useAppDispatch();
  const [editingRow, setEditingRow] = useState<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const getLevelColor = (level: string) => {
    const levelColors: { [key: string]: string } = {
      easy: '#578f57',
      medium: 'yellow',
      hard: '#DA6F6F',
    };

    return levelColors[level];
  };

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

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Название задачи',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      editable: true,
      render: (title: string, record: ITaskData) => {
        if (editingRow === record.id) {
          return (
            <Form.Item name={'title'} style={{ margin: 0 }}>
              <Input />
            </Form.Item>
          );
        } else {
          return searchValue ? (
            <Highlighter searchWords={[searchValue]} textToHighlight={title} />
          ) : (
            title
          );
        }
      },
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      render: (description: string, record: ITaskData) => {
        if (editingRow === record.id) {
          return (
            <Form.Item
              name="description"
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Please input description!' }]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return description;
        }
      },
    },
    {
      title: 'Оценка',
      dataIndex: 'point',
      key: 'point',
      sorter: true,
      render: (point: string, record: ITaskData) => {
        if (editingRow === record.id) {
          return (
            <Form.Item
              name="point"
              rules={[{ required: true, message: 'Please input point!' }]}
              style={{ margin: 0 }}
            >
              <Input type="number" />
            </Form.Item>
          );
        } else {
          return <span style={{ color: '#4dd7a2', fontWeight: 'bold' }}>{point}</span>;
        }
      },
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      sorter: true,
      editable: true,
      render: (level: string, record: ITaskData) => {
        if (editingRow === record.id) {
          return (
            <Form.Item
              name="level"
              rules={[{ required: true, message: 'Please input level!' }]}
              style={{ margin: 0 }}
            >
              <Select>
                <Option value="easy">easy</Option>
                <Option value="medium">medium</Option>
                <Option value="hard">hard</Option>
              </Select>
            </Form.Item>
          );
        } else {
          return <span style={{ color: getLevelColor(level) }}>{level}</span>;
        }
      },
    },
    {
      title: 'Действие',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: any, record: ITaskData) => {
        return (
          <>
            {editingRow === record.id ? (
              <Button htmlType="submit" className={'btn_save'}>
                <SaveOutlined />
              </Button>
            ) : (
              <EditOutlined onClick={() => handleEditTask(record)} />
            )}
            <DeleteOutlined
              onClick={() => {
                confirm({
                  title: 'Вы уверены, что хотите удалить задачу?',
                  icon: <ExclamationCircleOutlined />,
                  content: 'Задача будет удалена безвозвратно',
                  okText: 'Удалить',
                  okType: 'danger',
                  cancelText: 'Отмена',
                  onOk() {
                    if (record.id !== undefined) {
                      handleDeleteTask(record.id);
                    }
                  },
                  onCancel() {},
                });
              }}
              style={{ color: '#DA6F6F', margin: '0 15px' }}
            />
            <CheckCircleOutlined
              onClick={() => handleCompletedTask(record)}
              style={record.completed ? { color: '#9cc59c' } : { color: '#578f57' }}
            />
            <DoubleRightOutlined
              onClick={() => {
                dispatch(setId(record.id));
                navigate('/task/' + record.id);
              }}
              style={{ color: '#4a4acc', margin: '0 15px', transition: 'transform 0.5s' }} // Добавлена анимация
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
            />
          </>
        );
      },
    },
  ];

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
