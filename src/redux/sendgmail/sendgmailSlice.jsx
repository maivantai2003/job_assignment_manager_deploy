import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendGmail as sendGmailAPI } from './sendgmailAPI';

// Tạo async thunk để xử lý việc gọi API gửi email
export const sendGmail = createAsyncThunk('emails/sendGmail', async (gmail) => {
  const response = await sendGmailAPI(gmail);
  return response;
});

const initialState = {
  loading: false,
  success: null,
  error: null,
};

const sendGmailSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendGmail.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(sendGmail.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Email sent successfully!';
      })
      .addCase(sendGmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetStatus } = sendGmailSlice.actions;

export default sendGmailSlice.reducer;
