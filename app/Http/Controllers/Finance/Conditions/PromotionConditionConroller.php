<?php

namespace App\Http\Controllers\Finance\Conditions;

use App\Http\Resources\Finance\Conditions\PromotionConditionResources;
use App\Models\Color;
use App\Models\Finance\PromotionConditions;
use App\Models\Product;
use App\Models\Categories;
use App\Models\HeelHeight;
use Illuminate\Http\Request;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\Finance\Promotions;
use App\Models\Finance\Promotions as FinancePromotions;
use App\Http\Requests\Finance\Conditions\StorePromotionConditionRequest;

class PromotionConditionConroller extends Controller
{
    public function show(string $id)
    {
        // dd($id);

        $promotion = FinancePromotions::with(['promotionFrom', 'conditions'])->findOrFail($id);
        $conditions = PromotionConditions::with(['product', 'color', 'heelHeight', 'category'])->where('promotion_id', $id)->get();
        // dd($conditions);
        $data = Promotions::make($promotion);
        $conditionsQuery = PromotionConditionResources::collection($conditions);
        // dd($conditionsQuery);
                // dd($data);
        return inertia('Finance/Promotions/Conditions/Create/Page',[
            'promotion' => $data,
            'promotion_conditions' => $conditionsQuery,
            'products' => Product::all(),
            'colors' => Color::all(),
            'heel_heights' => HeelHeight::all(),
            'categories' => Categories::all(),
            'product_variants' => ProductVariant::all(),
        ]);
    }

    public function store(StorePromotionConditionRequest $request)
    {
        $payloads = $request->validated();
        
        $rows = collect($payloads['conditions'])
        ->map(fn($c) => [
            'promotion_id'     => $payloads['promotion_id'],
            'discount_type'    => $payloads['discount_type'],
            'discount_value'   => $payloads['discount_value'],
            'conditional_type' => $c['type'],
            'conditional_id'   => $c['id'],
        ])->toArray();

        DB::transaction(function() use ($rows) {
            PromotionConditions::insert($rows);
        });

        return redirect()->back()->with('success', 'Promotion conditions created successfully');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        dd($id);
    }


    public function destroy(string $id) {
        DB::transaction(function() use ($id){
            PromotionConditions::destroy($id);    
        });

        return redirect()->back()->with('success', 'Promotion conditions deleted successfully');
    }
}
