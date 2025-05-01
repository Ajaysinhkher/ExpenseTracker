import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from '../axios';
import { addExpense, updateExpense, deleteExpense } from './expenseSlice';


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
        })
        // listen to actions of expense slice aand accordingly update the state in groups.expense to avoid unnecessary api calls.
        .addCase(addExpense.fulfilled, (state, action) => {
          const newExpense = action.payload.expense;
          const group = state.groups.find(g => g.id === newExpense.group_id);
          if (group) {
            group.expenses.push(newExpense);
          }
        })
        .addCase(updateExpense.fulfilled, (state, action) => {
          const updatedExpense = action.payload.expense;
          const group = state.groups.find(g => g.id === updatedExpense.group_id);
          if (group) {
            const index = group.expenses.findIndex(exp => exp.id === updatedExpense.id);
            if (index !== -1) {
              group.expenses[index] = updatedExpense;
            }
          }
        })
        .addCase(deleteExpense.fulfilled, (state, action) => {

          console.log("inside addcase delete");
          
          const deletedExpenseId = action.payload.expense.id;
          console.log("expense index",deletedExpenseId);
          const groupIndex = state.groups.findIndex(g => g.id === action.payload.expense.group_id);
          console.log("group index",groupIndex);
          
          if (groupIndex !== -1) {
            const group = state.groups[groupIndex];
        
            // Create a new expenses array
            const updatedExpenses = group.expenses.filter(exp => exp.id !== deletedExpenseId);
            console.log("updated expense array:",updatedExpenses);
            
            // Replace the group object with a new object to ensure immutability
            state.groups[groupIndex] = {
              ...group,
              expenses: updatedExpenses
            };
          }
        });
        
   

    }
});

export const{ } = groupSlice.actions;
export default groupSlice.reducer;