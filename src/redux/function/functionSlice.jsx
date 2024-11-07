import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFunctions as fetchAPI, addFunction as addAPI, updateFunction as updateAPI } from './functionAPI';

export const fetchFunctions = createAsyncThunk('functions/fetchFunctions', async ({ search, page }) => {
  const response = await fetchAPI(search, page);
  return response;
});

export const addFunction = createAsyncThunk('functions/addFunction', async (func) => {
  const response = await addAPI(func);
  return response;
});

export const updateFunction = createAsyncThunk('functions/updateFunction', async ({ id, func }) => {
  const response = await updateAPI(id, func);
  return response;
});

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const functionSlice = createSlice({
  name: 'functions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunctions.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchFunctions.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchFunctions.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addFunction.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateFunction.fulfilled, (state, action) => {
        const index = state.list.findIndex((func) => func.maChucNang === action.payload.maChucNang);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default functionSlice.reducer;
