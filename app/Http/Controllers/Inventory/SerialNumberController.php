<?php

namespace App\Http\Controllers\Inventory;

use App\Repositories\Inventory\Serials\SerialRepository;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Inventory\SerialNumbers;

class SerialNumberController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    protected $serialRepository;

    public function __construct(SerialRepository $serialRepository)
    {
        $this->serialRepository = $serialRepository;
    }

    public function index()
    {
        
        return inertia('Inventory/Serials/Page', [
            'serial_numbers' => $this->serialRepository->getAllSerialWithCustomJoins(10),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
