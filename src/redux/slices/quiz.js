import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchQuizzes, postQuiz, putQuiz, deleteQuiz, updateAvailability, fetchGuestQuiz, updateTry } from "../../services/apiService";

// Fetch all quizzes
export const fetchAllQuizzes = createAsyncThunk(
    'quiz/fetchQuizzes',
    async (topic, { rejectWithValue }) => {
        try {
            return await fetchQuizzes(topic);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchGuestQuizzes = createAsyncThunk(
    'quiz/fetchGuestQuizzes',
    async (topic, { rejectWithValue }) => {
        try {
            return await fetchGuestQuiz(topic);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Add a new quiz
export const addQuiz = createAsyncThunk(
    'quiz/addQuiz',
    async (newQuiz, { rejectWithValue }) => {
        try {
            return await postQuiz(newQuiz);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Update a quiz
export const updateQuiz = createAsyncThunk(
    'quiz/updateQuiz',
    async ({ id, updatedQuiz }, { rejectWithValue }) => {
        try {

            return await putQuiz(id, updatedQuiz);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


export const updateQuizAvailability = createAsyncThunk(
    'quiz/updateAvailability',
    async (id, { rejectWithValue }) => {
        try {
            return await updateAvailability(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const updateQuizTry = createAsyncThunk(
    'quiz/updateTry',
    async (id, { rejectWithValue }) => {
        try {
            return await updateTry(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);






// Delete a quiz
export const deleteSingleQuiz = createAsyncThunk(
    'quiz/deleteQuiz',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteQuiz(id);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        quizzes: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllQuizzes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllQuizzes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.quizzes = action.payload;
            })
            .addCase(fetchAllQuizzes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            .addCase(fetchGuestQuizzes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGuestQuizzes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.quizzes = action.payload;
            })
            .addCase(fetchGuestQuizzes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })


            .addCase(addQuiz.fulfilled, (state, action) => {
                state.quizzes.push(action.payload.quiz);
            })
            .addCase(addQuiz.rejected, (state, action) => {
                state.error = action.payload.message;
            })

            .addCase(updateQuiz.fulfilled, (state, action) => {
                const index = state.quizzes.findIndex(quiz => quiz._id === action.payload.quiz._id);
                if (index !== -1) state.quizzes[index] = action.payload.quiz;
            })
            .addCase(updateQuiz.rejected, (state, action) => {
                state.error = action.payload.message;
            })

            .addCase(deleteSingleQuiz.fulfilled, (state, action) => {
                state.quizzes = state.quizzes.filter(quiz => quiz._id != action.payload.id);
            })
            .addCase(deleteSingleQuiz.rejected, (state, action) => {
                state.error = action.payload.message;
            })
            .addCase(updateQuizAvailability.fulfilled, (state, action) => {
                const index = state.quizzes.findIndex(quiz => quiz._id === action.payload.quiz._id);
                if (index !== -1) state.quizzes[index] = action.payload.quiz;
            })
            .addCase(updateQuizAvailability.rejected, (state, action) => {
                state.error = action.payload.message;
            })
            .addCase(updateQuizTry.fulfilled, (state, action) => {
                const index = state.quizzes.findIndex(quiz => quiz._id === action.payload.quiz._id);
                if (index !== -1) state.quizzes[index] = action.payload.quiz;
            })
            .addCase(updateQuizTry.rejected, (state, action) => {
                state.error = action.payload.message;
            });

    },
});

export default quizSlice.reducer;
