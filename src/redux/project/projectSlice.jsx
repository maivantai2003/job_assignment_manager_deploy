import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProjects as fetchAPI, addProject as addAPI, updateProject as updateAPI,fetchByIdProject as fetchByIdAPI } from './projectAPI';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async ({ search, page }) => {
  const response = await fetchAPI(search, page);
  return response;
});

export const addProject = createAsyncThunk('projects/addProject', async (project) => {
  const response = await addAPI(project);
  return response;
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, project }) => {
  const response = await updateAPI(id, project);
  return response;
});
export const fetchByIdProject = createAsyncThunk('projects/fetchByIdProject', async (id) => {
  const response = await fetchByIdAPI(id);
  return response;
});

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex((project) => project.maDuAn === action.payload.maDuAn);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      }).addCase(fetchByIdProject.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        const index = state.list.findIndex((project) => project.maDuAn === action.payload.maDuAn);
        if (index === -1) {
          state.list.push(action.payload);
        } else {
          state.list[index] = action.payload;
        }
      })
      .addCase(fetchByIdProject.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
