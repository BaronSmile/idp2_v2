import { Space, Tabs, TabsProps } from 'antd';

import './FilterBtn.scss';
import { useAppDispatch } from '../../providers/store';
import { setCompleted } from '../../providers/store/reducers/tasksSlice.ts';

const FilterBtn = () => {
  const dispatch = useAppDispatch();

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Все задачи',
    },
    {
      key: '2',
      label: 'Активные задачи',
    },
    {
      key: '3',
      label: 'Завершенные задачи',
    },
  ];
  const handleClick = (text: string) => {
    switch (text) {
      case '1':
        dispatch(setCompleted(undefined));
        break;
      case '2':
        dispatch(setCompleted(false));
        break;
      case '3':
        dispatch(setCompleted(true));
        break;
      default:
        break;
    }
  };

  return (
    <Space align={'center'} size={'middle'} className={'table_title'}>
      <Tabs className={'tabs_filter'} defaultActiveKey={'1'} items={items} onChange={handleClick} />
    </Space>
  );
};

export default FilterBtn;
