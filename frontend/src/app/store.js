import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import groupReducer from '../features/groupSlice';
import expenseReducer from '../features/expenseSlice'

const store = configureStore({
    reducer:{
        auth:authReducer,
        group:groupReducer,
    expense:expenseReducer
    }
})


export default store;