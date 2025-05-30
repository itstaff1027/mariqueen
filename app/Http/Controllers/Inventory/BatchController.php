<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Inventory\Batches\BatchRepository;
use App\Http\Requests\Inventory\Batches\StoreBatchesRequest;
use App\Http\Requests\Inventory\Batches\UpdateBatchRequest;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Inventory\Batches;

use Illuminate\Support\Facades\Auth;

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
        return inertia('Inventory/Batches/Create/Page', [
            'warehouses' => Warehouse::all()
        ]);
    }

    public function store(StoreBatchesRequest $request)
    {
        // dd($request);
        // dd($request);
        $validated = $request->validated();
        // dd($validated);
        DB::transaction(function () use ($validated) {
            Batches::create([
                'batch_number' => 'BN-' . str_pad(Batches::max('id') + 1, 6, '0', STR_PAD_LEFT), // Generate a unique order number.
                'manufacturing_date' => $validated['manufacturing_date'],
                'expiry_date' => $validated['expiry_date'],
                'received_date' => $validated['received_date'],
                'description' => $validated['description'],
                'warehouse_id' => $validated['warehouse_id'],
                'user_id' => Auth::user()->id,
                'created_at' => Carbon::now()
            ]);
        });
        return redirect()->route('batches.index')->with('success', 'Successfully Created a Batch!');
    }

    public function show()
    {
        return;
    }

    public function edit(string $id)
    {
        return inertia('Inventory/Batches/Edit/Page', [
            'batch' => $this->batchRepository->getBatchWithWarehouse($id),
            'warehouses' => Warehouse::all(),
        ]);
    }

    public function update(UpdateBatchRequest $request)
    {
        $validated = $request->validated();
        // dd($validated);
        DB::transaction(function () use ($validated) {
            $batch = Batches::findOrFail($validated['batch_id']);

            $batch->update([
                'manufacturing_date' => $validated['manufacturing_date'],
                'expiry_date' => $validated['expiry_date'],
                'received_date' => $validated['received_date'],
                'description' => $validated['description'],
                'warehouse_id' => $validated['warehouse_id'],
                'user_id' => Auth::user()->id,
                'updated_at' => Carbon::now()
            ]);
        });
        return redirect()->route('batches.index')->with('success', 'Successfully Updated a Batch!');
    }

    public function destroy(string $id)
    {
        DB::transaction(function () use ($id) {
            Batches::findOrFail($id)->delete();
        });

        return redirect()->route('batches.index')->with('success', 'Successfully Deleted Batch!');
    }
}
