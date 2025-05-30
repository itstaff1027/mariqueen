
<?php

namespace App\Repositories\Inventory\Warehouses;

use Carbon\Carbon;
use Illuminate\Support\Facedes\DB;
use App\Models\Warehouse;

class BatchRepository
{

    public function getAllWarehousesPlain()
    {
        return Warehouse::all();
    }

    public function getPaginatedWarehousePlain($pagination_value)
    {
        // return Batches::with(['user', 'warehouse'])->paginate($pagination_value);
    }

    public function getBatchWithSerialNumbers()
    {
        // return Batches::with('serialNumbers')->paginate(5);
    }
}
