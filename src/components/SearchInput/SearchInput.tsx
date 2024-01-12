import { Input } from 'antd';
import React from 'react';
import { useAppDispatch } from '../../providers/store';
import { setSearchValue } from '../../providers/store/reducers/tasksSlice.ts';

const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch();

  const onSearchHandler = (value: string) => {
    dispatch(setSearchValue(value));
  };

  return (
    <Input.Search
      allowClear
      size={'large'}
      placeholder={'Поиск по названию задачи'}
      style={{ marginBottom: '20px' }}
      onSearch={onSearchHandler}
    />
  );
};

export default SearchInput;
