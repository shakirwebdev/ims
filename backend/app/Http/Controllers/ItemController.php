<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Services\ItemService;
use Illuminate\Http\JsonResponse;

class ItemController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @param ItemService $itemService
     */
    public function __construct(
        private readonly ItemService $itemService
    ) {}

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $items = $this->itemService->getAllItems();
        
        return response()->json($items);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreItemRequest $request
     * @return JsonResponse
     */
    public function store(StoreItemRequest $request): JsonResponse
    {
        $item = $this->itemService->createItem($request->validated());
        
        return response()->json($item, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $item = $this->itemService->findItem($id);
            
            return response()->json($item);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Item not found'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateItemRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateItemRequest $request, int $id): JsonResponse
    {
        try {
            $item = $this->itemService->updateItem($id, $request->validated());
            
            return response()->json($item);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Item not found'
            ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->itemService->deleteItem($id);
            
            return response()->json(null, 204);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Item not found'
            ], 404);
        }
    }
}
