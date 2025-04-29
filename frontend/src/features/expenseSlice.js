import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axios';

export const addExpense = createAsyncThunk('expense/add', async (expenseData, thunkAPI) => {
  try {
    console.log("inside addexpense");
    
    const response = await axiosInstance.post('/expense/add', expenseData);

    console.log("returned data:",response.data);
    
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Expense not added!');
  }
});

// export const getExpenses = createAsyncThunk('expense/get', async (_, thunkAPI) => {
//   try {
//     const response = await axiosInstance.get('/expense/get');
//     return response.data;
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.response?.data?.message || 'Expenses not found!');
//   }
  
// });


export const updateExpense = createAsyncThunk('expense/update', async (expenseData, thunkAPI) => {
  try {
    console.log("inside updateEpense");
    
    const response = await axiosInstance.put('/expense/update', expenseData);

    console.log("returned data:",response.data);
    
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Expense not updated!');
  }
});

export const deleteExpense = createAsyncThunk('expense/delete', async (expenseId, thunkAPI) => {
  try {
    console.log("inside deleteExpense");
    
    const response = await axiosInstance.delete(`/expense/delete/${expenseId}`);

    console.log("returned data:",response.data);
    
    return response.data;
  } catch (error) {
    console.log('Delete Expense Error:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Expense not deleted!');
  }
});


const initialState = {
  expenses: [],
  isLoading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload.expenses; // Update the state with fetched expenses
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses.push(action.payload.expense); // Add the newly added expense
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload.expense;
      
        // Replace the updated expense in the local state
        const group = state.expenses.find(group => group.id === updated.group_id);
        if (group) {
          const index = group.expenses.findIndex(exp => exp.id === updated.id);
          if (index !== -1) {
            group.expenses[index] = updated;
          }
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Remove the deleted expense from the state
        const expenseId = action.payload.expense.id;
        state.expenses = state.expenses.filter(expense => expense.id !== expenseId);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }); 
      
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
