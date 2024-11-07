import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchReminders as fetchAPI} from './reminderAPI';

export const fetchReminders = createAsyncThunk('functions/fetchReminders', async () => {
  const response = await fetchAPI();
  return response;
});

// export const addFunction = createAsyncThunk('functions/addFunction', async (func) => {
//   const response = await addAPI(func);
//   return response;
// });

// export const updateFunction = createAsyncThunk('functions/updateFunction', async ({ id, func }) => {
//   const response = await updateAPI(id, func);
//   return response;
// });

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const reminderSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReminders.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchReminders.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchReminders.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
    //   .addCase(addFunction.fulfilled, (state, action) => {
    //     state.list.push(action.payload);
    //   })
    //   .addCase(updateFunction.fulfilled, (state, action) => {
    //     const index = state.list.findIndex((func) => func.maChucNang === action.payload.maChucNang);
    //     if (index !== -1) {
    //       state.list[index] = action.payload;
    //     }
    //   });
  },
});

export default reminderSlice.reducer;
