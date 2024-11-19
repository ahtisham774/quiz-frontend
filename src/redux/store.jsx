import { configureStore } from "@reduxjs/toolkit"

import quizReducer from "./slices/quiz"
import logReducer from "./slices/logs"

const store = configureStore({
    reducer: {
        quiz: quizReducer,
        log: logReducer
    }
})

export default store