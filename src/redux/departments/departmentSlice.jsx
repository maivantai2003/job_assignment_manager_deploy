import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDepartment as fetchAPI,
  addDepartment as addAPI,
  updateDepartment as updateAPI,
  fetchManagerDepartment as fetchManagerDepartmentAPI,
} from "./departmentAPI";

export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async ({ search, page }) => {
    const response = await fetchAPI(search, page);
    return response;
  }
);

export const addDepartment = createAsyncThunk(
  "departments/addDepartment",
  async (department) => {
    const response = await addAPI(department);
    return response;
  }
);
export const updateDepartment = createAsyncThunk(
  "departments/updateDepartment",
  async ({ id, department }) => {
    const response = await updateAPI(id, department);
    return response;
  }
);

export const fetchManagerDepartment = createAsyncThunk(
  "departments/fetchManagerDepartment",
  async (id) => {
    const response = await fetchManagerDepartmentAPI(id);
    return response;
  }
);
const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All",
};

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchManagerDepartment.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchManagerDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchManagerDepartment.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default departmentSlice.reducer;
