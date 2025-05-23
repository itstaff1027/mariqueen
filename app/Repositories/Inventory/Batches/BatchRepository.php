<?php

namespace App\Repositories\Inventory\Batches;

use Carbon\Carbon;
use Illuminate\Support\Facedes\DB;
use App\Models\Inventory\Batches;

class BatchRepository
{

    public function getAllBatches()
    {
        return Batches::all();
    }

    public function getPaginatedBatches($pagination_value)
    {
        return Batches::with(['user', 'warehouse'])->paginate($pagination_value);
    }

    public function getBatchWithSerialNumbers()
    {
        return Batches::with('serialNumbers')->paginate(5);
    }
}
