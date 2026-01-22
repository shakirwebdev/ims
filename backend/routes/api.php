<?php

use App\Http\Controllers\HealthController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'check']);

Route::apiResource('items', ItemController::class);
