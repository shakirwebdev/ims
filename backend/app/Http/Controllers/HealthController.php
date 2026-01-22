<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HealthController extends Controller
{
    public function check()
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Backend API is running',
            'timestamp' => now(),
            'version' => '1.0.0'
        ]);
    }
}
