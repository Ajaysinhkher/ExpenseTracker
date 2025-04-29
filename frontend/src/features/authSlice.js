import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

const API_URL = 'http://127.0.0.1:8000/api';

// LOGIN
export const loginUser = createAsyncThunk('auth/login', async (formData, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/login`, formData);
    const { user, access_token } = response.data;

    localStorage.setItem('token', access_token);
    return { user, access_token };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

// REGISTER
export const registerUser = createAsyncThunk('auth/register', async (formData, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/register`, formData);
    const { user, access_token } = response.data;

    localStorage.setItem('token', access_token);
    return { user, access_token };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

// GET LOGGED IN USER
export const getUser = createAsyncThunk('auth/getUser', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return thunkAPI.rejectWithValue('No token found');

    const response = await axiosInstance.get(`${API_URL}/user`);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Fetching user failed');
  }
});

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isRegister: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.isRegister = !state.isRegister;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      // GET USER
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { toggleMode, logout } = authSlice.actions;
export default authSlice.reducer;
