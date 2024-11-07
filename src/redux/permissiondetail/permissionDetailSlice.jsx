import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPermissionDetails as fetchAPI, addPermissionDetail as addAPI, updatePermissionDetail as updateAPI,
  deletePermissionDetail as deleteAPI,checkPermission as checkPermissionAPI
 } from './permissionDetailAPI';

export const fetchPermissionDetails = createAsyncThunk('permissionDetails/fetchPermissionDetails', async () => {
  const response = await fetchAPI();
  return response;
});

export const addPermissionDetail = createAsyncThunk('permissionDetails/addPermissionDetail', async (permissionDetail) => {
  const response = await addAPI(permissionDetail);
  return response;
});

export const updatePermissionDetail = createAsyncThunk('permissionDetails/updatePermissionDetail', async ({ id, permissionDetail }) => {
  const response = await updateAPI(id, permissionDetail);
  return response;
});
export const deletePermissionDetail = createAsyncThunk('permissionDetails/deletePermissionDetail', async (id) => {
  const response = await deleteAPI(id);
  return response;
});
export const checkPermission = createAsyncThunk('permissionDetails/checkPermission', async (permissionDetail) => {
  const response = await checkPermissionAPI(permissionDetail)
  return response;
});
const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const permissionDetailSlice = createSlice({
  name: 'permissionDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionDetails.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchPermissionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchPermissionDetails.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addPermissionDetail.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updatePermissionDetail.fulfilled, (state, action) => {
        const index = state.list.findIndex((permissionDetail) => permissionDetail.maChiTietQuyen === action.payload.maChiTietQuyen);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      }).addCase(deletePermissionDetail.fulfilled, (state, action) => {
        state.list = state.list.filter(permissionDetail => permissionDetail.maChiTietQuyen !== action.payload.maChiTietQuyen);
    });;
  },
});

export default permissionDetailSlice.reducer;
