import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFile as fetchAPI, addFile as addAPI, deleteFile as deleteAPI,fetchAllFile as fetchAllFileAPI } from './fileAPI';

export const fetchFile = createAsyncThunk('files/fetchFile', async (id) => {
    const response = await fetchAPI(id);
    return response;
});
export const fetchAllFile = createAsyncThunk('files/fetchAllFile', async () => {
    const response = await fetchAllFileAPI();
    return response;
});

export const addFile = createAsyncThunk('files/addFile', async (file) => {
    const response = await addAPI(file);
    return response;
});

export const deleteFile = createAsyncThunk('files/deleteFile', async (id) => {
    await deleteAPI(id);
    return id;
});

const initialState = {
    list: [],
    loading: false,
    error: null,
};

const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllFile.pending, (state) => {
            state.loading = true;
            state.status = 'loading';
          })
          .addCase(fetchAllFile.fulfilled, (state, action) => {
            state.loading = false;
            state.status = 'succeeded';
            state.list = action.payload;
          })
          .addCase(fetchAllFile.rejected, (state, action) => {
            state.loading = false;
            state.status = 'failed';
            state.error = action.error.message;
          })
            .addCase(fetchFile.fulfilled, (state, action) => {
                state.list.push(action.payload); // Or handle based on your use case
            })
            .addCase(addFile.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.list = state.list.filter(file => file.id !== action.payload);
            });
    },
});

export default fileSlice.reducer;
