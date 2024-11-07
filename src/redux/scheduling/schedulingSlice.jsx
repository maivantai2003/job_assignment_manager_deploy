import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendNotification as sendAPI} from './schedulingAPI';

export const sendNotification = createAsyncThunk('scheduling/sendCheduling', async (scheduling) => {
  const response = await sendAPI(scheduling);
  return response;
});
const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const schedulingSlice = createSlice({
  name: 'schedulings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
  },
});
export default schedulingSlice.reducer;
