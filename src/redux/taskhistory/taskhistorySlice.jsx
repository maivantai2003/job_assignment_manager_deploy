import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    fetchTaskHistories as fetchAPI, 
    addTaskHistory as addAPI, 
    updateTaskHistory as updateAPI,
    fetchTaskHistoryById as fetchByIdAPI,
    deleteTaskHistory as deleteAPI 
} from './taskhistoryAPI';

export const fetchTaskHistories = createAsyncThunk('taskHistories/fetchTaskHistories', async () => {
    const response = await fetchAPI();
    return response;
});

export const addTaskHistory = createAsyncThunk('taskHistories/addTaskHistory', async (taskHistory) => {
    const response = await addAPI(taskHistory);
    return response;
});

export const updateTaskHistory = createAsyncThunk('taskHistories/updateTaskHistory', async ({ id, taskHistory }) => {
    const response = await updateAPI(id, taskHistory);
    return response;
});

export const fetchTaskHistoryById = createAsyncThunk('taskHistories/fetchTaskHistoryById', async (id) => {
    const response = await fetchByIdAPI(id);
    return response;
});

export const deleteTaskHistory = createAsyncThunk('taskHistories/deleteTaskHistory', async (id) => {
    const response = await deleteAPI(id);
    return response;
});

const initialState = {
    list: [],
    loading: false,
    error: null,
    status: "All"
};

const taskHistorySlice = createSlice({
    name: 'taskHistories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskHistories.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
            })
            .addCase(fetchTaskHistories.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchTaskHistories.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchTaskHistoryById.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
            }).addCase(fetchTaskHistoryById.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                const index = state.list.findIndex((taskHistory) => taskHistory.maCongViec === action.payload.maCongViec);
                if (index !== -1) {
                    state.list[index] = action.payload;
                } else {
                    state.list.push(action.payload);
                }
            })
            // .addCase(fetchTaskHistoryById.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.status = 'succeeded';
            //     state.currentTaskHistory = action.payload;
            // })
            .addCase(fetchTaskHistoryById.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addTaskHistory.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateTaskHistory.fulfilled, (state, action) => {
                const index = state.list.findIndex((taskHistory) => taskHistory.maLichSuCongViec === action.payload.maLichSuCongViec);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteTaskHistory.fulfilled, (state, action) => {
                const index = state.list.findIndex((taskHistory) => taskHistory.maLichSuCongViec === action.payload.maLichSuCongViec);
                if (index !== -1) {
                    state.list.splice(index, 1);
                }
            });
    },
});

export default taskHistorySlice.reducer;
