import React from 'react';
import Highlighter from 'react-highlight-words';
import { ITask } from '../../types.ts';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useAppDispatch } from '../../providers/store';
import { setPage, setSort, setSortTitle } from '../../providers/store/reducers/tasksSlice.ts';

import './Tasks.scss';

interface ITasksProps {
  searchValue: string;
  isLoading?: boolean;
  refetch?: never;
  totalCount?: number;
  dataList: ITask[];
}
const Tasks: React.FC<ITasksProps> = ({ searchValue, isLoading, dataList }) => {
  const dispatch = useAppDispatch();

  const getLevelColor = (level: string) => {
    const levelColors: { [key: string]: string } = {
      easy: '#578f57',
      medium: 'yellow',
      hard: '#DA6F6F',
    };

    return levelColors[level];
  };

  const rowStyle = (record: ITask) => {
    return record.completed ? 'opacity_row' : '';
  };

  const columns: ColumnsType<ITask> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Задача',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (title: string) =>
        searchValue ? <Highlighter searchWords={[searchValue]} textToHighlight={title} /> : title,
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Оценка',
      dataIndex: 'point',
      key: 'point',
      render: (point: string) => (
        <span style={{ color: '#4dd7a2', fontWeight: 'bold' }}>{point}</span>
      ),
      sorter: true,
    },
    {
      title: 'Уровень',
      dataIndex: 'level',
      key: 'level',
      sorter: true,
      render: (level: string) => <span style={{ color: getLevelColor(level) }}>{level}</span>,
    },
    {
      title: 'Действие',
      dataIndex: 'operation',
      key: 'operation',

      render: () => {
        return (
          <>
            <EditOutlined
            // onClick={() => onEditTask(record)}
            />
            <DeleteOutlined
              // onClick={() => onDeleteTask(record.id)}
              style={{ color: '#DA6F6F', margin: ' 0 15px' }}
            />
            <CheckCircleOutlined
              // onClick={() => onCompleteTask(record)}
              style={{ color: '#578f57' }}
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

  return (
    <div>
      <Table
        rowKey={(record) => record.id || Date.now()}
        rowClassName={rowStyle}
        loading={isLoading}
        className="tasks_table"
        dataSource={dataList}
        columns={columns}
        onChange={handleTableChange}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} задач`,
          onChange: (page) => {
            dispatch(setPage(page));
          },
        }}
      />
    </div>
  );
};

export default Tasks;
