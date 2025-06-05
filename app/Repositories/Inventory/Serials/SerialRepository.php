<?php

namespace App\Repositories\Inventory\Serials;

use App\Models\Inventory\SerialNumbers;
use Carbon\Carbon;
use Illuminate\Support\Facedes\DB;
use App\Models\Inventory\Serials;

class SerialRepository
{

    public function getAllSerials()
    {
        return SerialNumbers::all();
    }

    public function getPaginatedSerials($pagination_value)
    {
        return SerialNumbers::with(['user', 'warehouse'])->paginate($pagination_value);
    }

    public function getSerialWithWarehouse($serial_number_id)
    {
        return SerialNumbers::with(['warehouse'])->findOrFail($serial_number_id);
    }

    public function getAllSerialWithCustomJoins($pagination_value)
    {
        return SerialNumbers::with('productVariant', 'warehouse', 'batch')->paginate($pagination_value);
    }
}
