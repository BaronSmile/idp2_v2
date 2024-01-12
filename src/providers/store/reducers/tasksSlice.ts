import { createSlice } from '@reduxjs/toolkit';

interface ITasks {
  page: number;
  count: number;
  searchValue: string;
  sort?: 'asc' | 'desc' | undefined;
  sortTitle?: string;
  completed?: boolean | null;
}

const initialState: ITasks = {
  page: 1,
  count: 10,
  searchValue: '',
  sort: 'asc',
  sortTitle: 'id',
  completed: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setCount(state, action) {
      state.count = action.payload;
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload.trim();
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setSortTitle(state, action) {
      state.sortTitle = action.payload;
    },
    setCompleted(state, action) {
      state.completed = action.payload;
    },
  },
});

export const { setPage, setCount, setSearchValue, setSort, setSortTitle, setCompleted } =
  tasksSlice.actions;

export default tasksSlice.reducer;
