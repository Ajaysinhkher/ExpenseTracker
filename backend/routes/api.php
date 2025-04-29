<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ExpenseController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/group/get',[GroupController::class,'show']);
Route::middleware('auth:sanctum')->post('/group/add',[GroupController::class,'create']);



Route::middleware('auth:sanctum')->post('/expense/add',[ExpenseController::class,'create']);
Route::middleware('auth:sanctum')->put('/expense/update',[ExpenseController::class,'update']);
Route::middleware('auth:sanctum')->delete('/expense/delete/{id}',[ExpenseController::class,'destroy']);