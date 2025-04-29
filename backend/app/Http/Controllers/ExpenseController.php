<?php

namespace App\Http\Controllers;
use App\Models\Group;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function create(Request $request){
        $request->validate([
            'description'=> 'required',
            'amount' => 'required|numeric|min:0.01',
            'group_id' => 'required|exists:groups,id',
            'date' => 'required|date',
        ]);


        $user = Auth::user(); 

        if(!$user){
            return response()->json(['error'=>'unauthenticated user',401]);

        }

        $expense = Expense::create([
            'description' => $request->description,
            'amount' => $request->amount,
            'group_id' => $request->group_id,
            'date' => $request->date,
        ]);

        return response()->json(['expense' => $expense, 'message' => 'Expense created successfully'], 201);


    }


    public function update(Request $request){
        $request->validate([
            'description'=> 'required',
            'amount' => 'required|numeric|min:0.01',
            'group_id' => 'required|exists:groups,id',
            'date' => 'required|date',
            'id' => 'required|exists:expenses,id',
        ]);

        $user = Auth::user(); 

        if(!$user){
            return response()->json(['error'=>'unauthenticated user',401]);

        }

        $expense = Expense::find($request->id);

        if (!$expense) {
            return response()->json(['error' => 'Expense not found'], 404);
        }

        // Update fields
        $expense->description = $request->description;
        $expense->amount = $request->amount;
        $expense->group_id = $request->group_id;
        $expense->date = $request->date;
        $expense->save();

        return response()->json(['expense' => $expense, 'message' => 'Expense updated successfully'], 200);

    }


    public function destroy($id)
    {
        $user = Auth::user(); 
    
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated user'], 401);
        }
    
        $expense = Expense::find($id);
    
        if (!$expense) {
            return response()->json(['error' => 'Expense not found'], 404);
        }
    
        $expense->delete();
    
        return response()->json(['message' => 'Expense deleted successfully!']);
    }
    
}