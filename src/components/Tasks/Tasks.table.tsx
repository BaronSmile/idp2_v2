import { Button, Form, Input, Select, Tooltip, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { ITaskData } from '../../types/tasksType.ts';
import { setId } from '../../providers/store/reducers/tasksSlice.ts';

const { Option } = Select;
const { confirm } = Modal;

export const getTaskColumns = (
  searchValue: string,
  editingRow: number | null,
  handleEditTask: (record: ITaskData) => void,
  handleDeleteTask: (id: number) => void,
  handleCompletedTask: (record: ITaskData) => void,
  dispatch: any,
  navigate: any,
) => [
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
        const truncatedTitle = title.length > 30 ? `${title.slice(0, 30)}...` : title;
        return (
          <Tooltip title={title}>
            {searchValue ? (
              <Highlighter searchWords={[searchValue]} textToHighlight={truncatedTitle} />
            ) : (
              truncatedTitle
            )}
          </Tooltip>
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
        const truncatedDescription =
          description.length > 50 ? `${description.slice(0, 50)}...` : description;
        return (
          <Tooltip title={description}>
            <span>{truncatedDescription}</span>
          </Tooltip>
        );
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
            <Tooltip title="Сохранить">
              <Button htmlType="submit" className={'btn_save'}>
                <SaveOutlined />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip title="Редактировать">
              <EditOutlined onClick={() => handleEditTask(record)} />
            </Tooltip>
          )}
          <Tooltip title="Удалить">
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
          </Tooltip>
          <Tooltip
            title={record.completed ? 'Отметить как невыполненное' : 'Отметить как выполненное'}
          >
            <CheckCircleOutlined
              onClick={() => handleCompletedTask(record)}
              style={record.completed ? { color: '#9cc59c' } : { color: '#578f57' }}
            />
          </Tooltip>
          <Tooltip title="Перейти к задаче">
            <DoubleRightOutlined
              onClick={() => {
                dispatch(setId(record.id));
                navigate('/task/' + record.id);
              }}
              style={{ color: '#4a4acc', margin: '0 15px', transition: 'transform 0.5s' }} // Добавлена анимация
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
            />
          </Tooltip>
        </>
      );
    },
  },
];

export const getLevelColor = (level: string) => {
  const levelColors: { [key: string]: string } = {
    easy: '#578f57',
    medium: 'yellow',
    hard: '#DA6F6F',
  };

  return levelColors[level];
};
