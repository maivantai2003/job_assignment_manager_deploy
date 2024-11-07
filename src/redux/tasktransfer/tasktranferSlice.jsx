import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchTaskTransfers as fetchAPI,
  addTaskTransfer as addAPI,
} from "./tasktransferAPI";

export const fetchTaskTransfers = createAsyncThunk(
  "tasktransfer/fetchTaskTransfers",
  async ({ search, page }) => {
    const response = await fetchAPI(search, page);
    return response;
  }
);
export const addTaskTransfer = createAsyncThunk("tasktransfer/addTaskTranfer", async (taskTransfer) => {
  const response = await addAPI(taskTransfer);
  return response;
});
const initialState = {
    list: [],
    loading: false,
    error: null,
    status: "All"
};
const taskTransferSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTaskTransfers.pending, (state) => {
          state.loading = true;
          state.status = 'loading';
        })
        .addCase(fetchTaskTransfers.fulfilled, (state, action) => {
          state.loading = false;
          state.status = 'succeeded';
          state.list = action.payload;
        })
        .addCase(fetchTaskTransfers.rejected, (state, action) => {
          state.loading = false;
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(addTaskTransfer.fulfilled, (state, action) => {
          state.list.push(action.payload);
        });
    },
  });
  
  export default taskTransferSlice.reducer;
  