import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TableState {
  data: any[];
}

const initialState: TableState = {
  data: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    },
  },
});

export const { setData } = tableSlice.actions;

export default tableSlice.reducer;
