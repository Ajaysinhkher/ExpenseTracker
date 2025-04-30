<?php

namespace App\Http\Controllers;
use App\Models\Group;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;

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
    

  

    public function total(Request $request)
    {
        $user = Auth::user();
    
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated user'], 401);
        }
    
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;
    
        $baseQuery = Expense::whereHas('group', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        });
    
        $totalExpense = $baseQuery->sum('amount');
    
        $monthlyExpense = (clone $baseQuery)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->sum('amount');
    
        $highestExpenseThisMonth = (clone $baseQuery)
            ->whereYear('date', $currentYear)
            ->whereMonth('date', $currentMonth)
            ->max('amount');
    
        return response()->json([
            'total_expense' => $totalExpense,
            'monthly_expense' => $monthlyExpense,
            'highest_expense' => $highestExpenseThisMonth
        ]);
    }


    public function downloadpdf(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated user'], 401);
        }

        $groups = $request->input('groups');

        // Optional: you can validate structure
        if (!is_array($groups)) {
            return response()->json(['error' => 'Invalid data format'], 422);
        }

        $pdf = Pdf::loadView('pdf.expenses', ['groups' => $groups, 'user' => $user->name]);

        return $pdf->download('expenses.pdf');
    }


    public function downloadcsv(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated user'], 401);
        }

        $groups = $request->input('groups');

        if (!is_array($groups)) {
            return response()->json(['error' => 'Invalid data format'], 422);
        }

        // Create CSV content
        $csv = "Group Name,Expense Description,Amount,Date\n";
        foreach ($groups as $group) {
            $groupName = $group['name'] ?? 'Unknown';
            foreach ($group['expenses'] ?? [] as $expense) {
                $csv .= sprintf(
                    "\"%s\",\"%s\",%s,%s\n",
                    $groupName,
                    $expense['description'] ?? '',
                    $expense['amount'] ?? '',
                    $expense['date'] ?? ''
                );
            }
        }

        $filename = "expenses.csv";

        // Return response as downloadable CSV
        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ]);
    }
    
           
}