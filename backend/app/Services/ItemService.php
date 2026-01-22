<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ItemService
{
    /**
     * Get all items ordered by creation date.
     *
     * @return Collection
     */
    public function getAllItems(): Collection
    {
        return Item::orderBy('created_at', 'desc')->get();
    }

    /**
     * Find an item by ID.
     *
     * @param int $id
     * @return Item
     * @throws ModelNotFoundException
     */
    public function findItem(int $id): Item
    {
        return Item::findOrFail($id);
    }

    /**
     * Create a new item.
     *
     * @param array $data
     * @return Item
     */
    public function createItem(array $data): Item
    {
        return Item::create($data);
    }

    /**
     * Update an existing item.
     *
     * @param int $id
     * @param array $data
     * @return Item
     * @throws ModelNotFoundException
     */
    public function updateItem(int $id, array $data): Item
    {
        $item = $this->findItem($id);
        $item->update($data);
        
        return $item->fresh();
    }

    /**
     * Delete an item.
     *
     * @param int $id
     * @return bool
     * @throws ModelNotFoundException
     */
    public function deleteItem(int $id): bool
    {
        $item = $this->findItem($id);
        
        return $item->delete();
    }
}
