import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccount as fetchAPI, addAccount as addAPI, updateAccount as updateAPI } from './accountAPI';

export const fetchAccounts = createAsyncThunk('accounts/fetchAccounts', async ({ search, page }) => {
  const response = await fetchAPI(search, page);
  return response;
});
export const addAccount = createAsyncThunk('accounts/addAccount', async (account) => {
  const response = await addAPI(account);
  return response;
});
export const updateAccount = createAsyncThunk('accounts/updateAccount', async ({ id, account }) => {
  const response = await updateAPI(id, account);
  return response;
});

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // .addCase(updateAccount.fulfilled, (state, action) => {
      //   const index = state.list.findIndex((account) => account.maNhanVien === action.payload.maNhanVien);
      //   if (index !== -1) {
      //     state.list[index] = action.payload;
      //   }
      // });
  },
});

export default accountSlice.reducer;
