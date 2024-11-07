import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createChiTietFile as createAPI, fetchChiTietFileByPhanCong as fetchAPI,deleteChiTietFile as deleteAPI } from './fileassignmentAPI';

export const createChiTietFile = createAsyncThunk(
  'chiTietFile/createChiTietFile',
  async (chiTietFile) => {
    const response = await createAPI(chiTietFile);
    return response;
  }
);

export const fetchChiTietFileByPhanCong = createAsyncThunk(
  'chiTietFile/fetchChiTietFileByPhanCong',
  async (id) => {
    const response = await fetchAPI(id);
    return response;
  }
);
export const deleteChiTietFile=createAsyncThunk(
  'chiTietFile/deleteFile',
  async (id) => {
    const response = await deleteAPI(id);
    return response;
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "idle",
};
const chiTietFileSlice = createSlice({
  name: 'chiTietFile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createChiTietFile.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(createChiTietFile.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list.push(action.payload);
      })
      .addCase(createChiTietFile.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchChiTietFileByPhanCong.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchChiTietFileByPhanCong.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      }).addCase(deleteChiTietFile.fulfilled, (state, action) => {
        const index = state.list.findIndex((file) => file.maChiTietFile === action.payload.maChiTietFile);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(fetchChiTietFileByPhanCong.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export default chiTietFileSlice.reducer;
