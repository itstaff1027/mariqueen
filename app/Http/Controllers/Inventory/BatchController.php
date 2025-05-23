<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Inventory\Batches\BatchRepository;

class BatchController extends Controller
{
    protected $batchRepository;

    public function __construct(BatchRepository $batchRepository)
    {
        return $this->batchRepository = $batchRepository;
    }

    public function index()
    {
        return inertia('Inventory/Batches/Page', [
            'batches' => $this->batchRepository->getPaginatedBatches(10)
        ]);
    }

    public function create()
    {
        return;
    }

    public function store()
    {
        return;
    }

    public function show()
    {
        return;
    }

    public function edit()
    {
        return;
    }

    public function update()
    {
        return;
    }

    public function destroy()
    {
        return;
    }
}
