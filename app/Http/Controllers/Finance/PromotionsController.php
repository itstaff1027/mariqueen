<?php

namespace App\Http\Controllers\Finance;

use App\Http\Requests\Finance\UpdatePromotionRequest;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Finance\Promotions;
use App\Http\Resources\Finance\StorePromotions;
use App\Http\Requests\Finance\StorePromotionRequest;
use App\Models\Finance\Promotions as FinancePromotions;

class PromotionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Promotions::collection(FinancePromotions::all()));
        $data = Promotions::collection(FinancePromotions::all());
        // dd($data->collection[0]);
        return inertia('Finance/Promotions/Page', [
            'promotions' => $data->collection,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Finance/Promotions/Create/Page', [
            'warehouses' => Warehouse::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePromotionRequest $request)
    {   
        // dd($request);
        $data = $request->validated();

        DB::transaction(function () use ($data){
            FinancePromotions::insert([
                'name' => $data['promotion_name'],
                'type' => $data['type'],
                'discount_value' => $data['discount_value'],
                'is_active' => $data['is_active'],
                'starts_at'  => $data['starts_at'],
                'ends_at'    => $data['ends_at'],
                'promotion_from' => $data['promotion_from'],
            ]);
        });

        return redirect()->route('promotions.index')->with('success', 'Successfully Created a Promotion!');
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
        // dd($id);
        $promotion = FinancePromotions::findOrFail($id);
        $data = Promotions::make($promotion);

        return inertia('Finance/Promotions/Edit/Page', [
            'promotion' => $data,
            'warehouses' => Warehouse::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePromotionRequest $request, string $id)
    {
        $data = $request->validated();
        // dd($data);
        DB::transaction(function () use ($data, $id) {
            FinancePromotions::where('id', $id)->update(
                [
                'name' => $data['promotion_name'],
                'type' => $data['type'],
                'discount_value' => $data['discount_value'],
                'is_active' => $data['is_active'],
                'starts_at'  => $data['starts_at'],
                'ends_at'    => $data['ends_at'],
                'promotion_from' => $data['promotion_from'],
            ]);
        });

        return redirect()->back()->with('success', 'Successfully Updated a Promotion!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
