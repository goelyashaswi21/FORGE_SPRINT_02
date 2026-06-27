<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{AuthController, TicketController,
    CommentController, DashboardController, UserController, OrganizationController};

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/organizations', [OrganizationController::class, 'index']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('/tickets', TicketController::class);
    Route::apiResource('/tickets.comments', CommentController::class);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);
    Route::patch('/tickets/{ticket}/assign', [TicketController::class, 'assign']);
});
