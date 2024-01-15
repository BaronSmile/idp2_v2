import React, { useState } from 'react';
import { Button, Space } from 'antd';

import './FilterBtn.scss';
import { useAppDispatch } from '../../providers/store';
import { setCompleted } from '../../providers/store/reducers/tasksSlice.ts';

interface IProps {
  btnText: string[];
}
const FilterBtn: React.FC<IProps> = ({ btnText }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useAppDispatch();
  const handleClick = (index: number, text: string) => {
    setActiveIndex(index);
    switch (text) {
      case 'Все задачи':
        dispatch(setCompleted(undefined));
        break;
      case 'Активные задачи':
        dispatch(setCompleted(false));
        break;
      case 'Завершенные задачи':
        dispatch(setCompleted(true));
        break;
      default:
        break;
    }
  };

  return (
    <Space align={'center'} size={'middle'} className={'table_title'}>
      {btnText.map((text, idx) => (
        <Button
          key={idx}
          className={idx === activeIndex ? 'btn_active' : 'btn_completed'}
          onClick={() => handleClick(idx, text)}
        >
          {text}
        </Button>
      ))}
    </Space>
  );
};

export default FilterBtn;
