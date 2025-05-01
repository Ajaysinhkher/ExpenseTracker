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


export const getTotalExpense = createAsyncThunk('expense/total',async(_,thunkAPI)=>{
    try{
      console.log("inside get totalexpense");

      const response  = await axiosInstance.get('/expense/total');
      // console.log("total expense :",response.data);
      
      return response.data; 
    }catch(error){
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Total not fetched!');
    }

});



// api to download pdf:
export const downloadPDF = createAsyncThunk('expense/downloadPDF', async (groupsData, thunkAPI) => {
  try {
    console.log("inside download pdf");
    
    const response = await axiosInstance.post('/expense/pdf', { groups: groupsData },{
      responseType: 'blob', // important for binary file
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses.pdf';
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return 'PDF downloaded successfully';
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to export PDF');
  }
});


export const downloadCsv = createAsyncThunk('expense/downloadCSV', async (groupsData, thunkAPI) => {
  try {
    console.log("inside download csv");

    const response = await axiosInstance.post('/expense/csv', { groups: groupsData }, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv',
      },
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses.csv';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return 'CSV downloaded successfully';
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to export CSV');
  }
});



const initialState = {
  expenses: [],
  isLoading: false,
  error: null,
  summary: {
    total: null,
    monthly: null,
    highest: null,
  },
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
      })
      .addCase(getTotalExpense.pending, (state) => {
        
        state.isLoading = true;
      })
      .addCase(getTotalExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary.total = action.payload.total_expense;
        state.summary.monthly = action.payload.monthly_expense;
        state.summary.highest = action.payload.highest_expense;
      })
      .addCase(getTotalExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      
  },
});

export const { setExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;
