
<?php

namespace App\Services\Inventory\Batches;

use Carbon\Carbon;

use Illuminate\Support\Facades\DB;
use App\Repositories\Inventory\Batches\BatchRepository;

class BatchServices
{
    protected $batchRepository;

    public function __construct(batchRepository $batchRepository)
    {
        $this->batchRepository = $batchRepository;
    }
}
