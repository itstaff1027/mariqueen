<?php

namespace App\Http\Controllers\Inventory;

use Carbon\Carbon;
use App\Models\Color;
use App\Models\Product;
use App\Models\HeelHeight;
use App\Models\SizeValues;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Sales\MadeToOrderProducts;

class MadeToOrderProductsController extends Controller
{
    public function index(Request $request){
        $query = MadeToOrderProducts::with([
            'mto_items',
            'mto_items.mto_order'
        ])->orderBy('id','desc');
        
        // if ($request->filled('size_value')) {
        //     $query->whereHas('size_values', function ($q) use ($request) {
        //         $q->where('size_value_id', $request->size_value);
        //     });
        // }
        
        // if ($request->filled('heel_height')) {
        //     $query->whereHas('heelHeights', function ($q) use ($request) {
        //         $q->where('heel_height_id', $request->heel_height);
        //     });
        // }
        
        // if ($request->filled('color')) {
        //     $query->whereHas('colors', function ($q) use ($request) {
        //         $q->where('color_id', $request->color);
        //     });
        // }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('product_name', 'like', "%{$searchTerm}%");
            });
        }

        $mto_products = $query->paginate(15);

        // dd($mto_products);
        return inertia('Inventory/MadeToOrderProducts/Page', [
            'made_to_order_products' => $mto_products,
        ]);
    }

    public function create(){
        
    }

    public function edit(string $id){
        // dd($id);
        $mto_product = MadeToOrderProducts::with([
            'mto_items',
            'mto_items.mto_order'
        ])->findOrFail($id);

        // dd($mto_products);
        return inertia('Inventory/MadeToOrderProducts/Edit/Page', [
            'made_to_order_product' => $mto_product,
            'products' => Product::all(),
            'colors' => Color::all(),
            'sizes' => SizeValues::with(['size'])->get(),
            'heel_heights' => HeelHeight::all(),
        ]);
    }

    public function update(Request $request, string $id){
        $request->validate([
            'product_name' => 'required',
            'color_name' => 'required',
            'cost' => 'required'
        ]);
        // dd($request);
        $mto_product = MadeToOrderProducts::findOrFail($id);
        // dd($mto_product);
        $mto_product->update([
            'product_name' => $request->product_name,
            'color_name' => $request->color_name,
            'size' => $request->size_value,
            'heel_height' => $request->heel_height,
            'type_of_heel' => $request->type_of_heel,
            'round' => $request->round,
            'length' => $request->length,
            'back_strap' => $request->back_strap,
            'cost' => $request->cost,
            'updated_at' => Carbon::now(),
        ]);

        return redirect()->route('inventory_mto_products.index')->with('success', 'Made to order product updated successfully');
    }
}
