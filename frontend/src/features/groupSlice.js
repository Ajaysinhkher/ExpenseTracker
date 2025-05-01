import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from '../axios';


// const API_URL = 'http://127.0.0.1:8000/api';

export const addGroup = createAsyncThunk('group/add', async (newGroup, thunkAPI) => {
    try {

      console.log("inside add group:");
      
      const response = await axiosInstance.post('/group/add', newGroup);
        console.log("newgroup object:",newGroup);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Group Not Created!');
    }
  });


  export const getGroup = createAsyncThunk('group/get', async (_, thunkAPI) => {
    try {
        console.log("inside getGroup");
        
      const response = await axiosInstance.get('/group/get');    
      return response.data; 

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Groups Not found!');
    }
  });


const initialState = {
    groups:[],
    isLoading: false,
    error: null,
}

const groupSlice  = createSlice({
    name:"group",
    initialState,
    reducers:{
        setGroups: (state, action) => {
            state.groups = action.payload;
        },

    },

    extraReducers:(builder)=>{
        builder
        .addCase(getGroup.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getGroup.fulfilled, (state, action) => {
          state.isLoading = false;
          state.groups = action.payload.groups; // Update state with the fetched groups
        })
        .addCase(getGroup.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        })
        .addCase(addGroup.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(addGroup.fulfilled, (state, action) => {
          state.isLoading = false;
          state.groups.push(action.payload.group); // Add the newly created group to the state
        })
        .addCase(addGroup.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        });

    }
});

export const{ } = groupSlice.actions;
export default groupSlice.reducer;