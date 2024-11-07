import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAssignments as fetchAPI, addAssignment as addAPI, updateAssignment as updateAPI, deleteAssignment as deleteAPI,fetchEmployeeAssignment as fetchEmployeeAssignmentAPI} from './assignmentAPI';

export const fetchAssignments = createAsyncThunk('assignments/fetchAssignments', async ({ search, page }) => {
  const response = await fetchAPI(search, page);
  return response;
});

export const addAssignment = createAsyncThunk('assignments/addAssignment', async (assignment) => {
  const response = await addAPI(assignment);
  return response;
});

export const updateAssignment = createAsyncThunk('assignments/updateAssignment', async ({ id, assignment }) => {
  const response = await updateAPI(id, assignment);
  return response;
});

export const deleteAssignment = createAsyncThunk('assignments/deleteAssignment', async (id) => {
  const response = await deleteAPI(id);
  return response;
});
export const fetchEmployeeAssignment=createAsyncThunk('assignments/employeeAssignment', async (id) => {
  const response = await fetchEmployeeAssignmentAPI(id);
  return response;
})

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "idle"
};

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      }).addCase(fetchEmployeeAssignment.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
    })
    .addCase(fetchEmployeeAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
    })
    .addCase(fetchEmployeeAssignment.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
    })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.list.findIndex((assignment) => assignment.maPhanCong === action.payload.maPhanCong);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.list = state.list.filter((assignment) => assignment.maPhanCong !== action.payload.maPhanCong);
      });
  },
});

export default assignmentSlice.reducer;
