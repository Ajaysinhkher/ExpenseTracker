<?php

namespace App\Http\Controllers;
use App\Models\Group;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([

            'name'=>'required',
        ]);    

        // Get the currently authenticated user 
        $user = Auth::user(); 
      
      
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401); // If no user is authenticated
        }

        $group = Group::create([
            'name'=>$request->name,
            'user_id' => $user->id,
        ]);

        return response()->json(['group'=>$group, 'message' => 'Group created successfully'], 201);
    }

    public function show()
    {
        // Get the currently authenticated user
        $user = Auth::user(); 
    
        // Check if the user is authenticated
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401); // If no user is authenticated
        }
    
        // Retrieve all groups created by the authenticated user along with there expenses
        $groups = Group::with('expenses')->where('user_id', $user->id)->get();
    
        // Return the groups
        return response()->json(['groups' => $groups], 200);
    }
    
}
