<?php

namespace App\Http\Controllers\Finance;

use App\Models\Finance\DiscountPerItems;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Sales\Discounts;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class DiscountPerItemsController extends Controller
{
    public function index(){

    }
    public function create(Request $request){

        $discount = Discounts::with(['items', 'items.product'])->findOrFail($request->discount_id);

        return inertia('Finance/Discounts/Items/Create/Page',[
            'discount' => $discount,
            'products' => Product::all(),
        ]);      
    }

    public function store(Request $request){
        $request->validate([
            'product_id' => 'required',
        ]);

        DB::transaction(function () use ($request) {
            DiscountPerItems::create([
                'product_id' => $request->product_id,
                'discount_id' => $request->discount_id,
            ]);
        });

        return redirect()->back()->with('success', "Added product #{$request->product_id} 🎉");
    }

    public function edit(string $id){

    }

    public function update(Request $request, string $id){

    }

    public function destroy(string $id){
        DB::transaction(function () use ($id) {
            DiscountPerItems::findOrFail($id)->delete();
        });

        return redirect()->back()->with('success', "Successfully deleted item #{$id} 🎉");
    }
}
