import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import groupReducer from '../features/groupSlice';


const store = configureStore({
    reducer:{
        auth:authReducer,
        group:groupReducer,
    }
})


export default store;