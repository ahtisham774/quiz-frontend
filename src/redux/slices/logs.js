import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLogs, putLog, deleteLog, fetchStudentLogs } from "../../services/apiServiceLogs";

// Fetch all logs
export const fetchAllLogs = createAsyncThunk(
    'log/fetchLogs',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchLogs();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchStudentAllLogs = createAsyncThunk(
    'log/fetchStudentAllLogs',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchStudentLogs(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



// Update a log
export const updateLog = createAsyncThunk(
    'log/updateLog',
    async ({ id, updatedLog }, { rejectWithValue }) => {
        try {

            return await putLog(id, updatedLog);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);






// Delete a log
export const deleteSingleLog = createAsyncThunk(
    'log/deleteLog',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteLog(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const logSlice = createSlice({
    name: 'log',
    initialState: {
        logs: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllLogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllLogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.logs = action.payload;
            })
            .addCase(fetchAllLogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            .addCase(fetchStudentAllLogs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStudentAllLogs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.logs = action.payload;
            })
            .addCase(fetchStudentAllLogs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })


            .addCase(updateLog.fulfilled, (state, action) => {
                const index = state.logs.findIndex(log => log._id === action.payload.log._id);
                if (index !== -1) state.logs[index] = action.payload.log;
            })
            .addCase(updateLog.rejected, (state, action) => {
                state.error = action.payload.message;
            })

            .addCase(deleteSingleLog.fulfilled, (state, action) => {
                state.logs = state.logs.filter(log => log._id != action.payload.id);
            })
            .addCase(deleteSingleLog.rejected, (state, action) => {
                state.error = action.payload.message;
            })


    },
});

export default logSlice.reducer;
