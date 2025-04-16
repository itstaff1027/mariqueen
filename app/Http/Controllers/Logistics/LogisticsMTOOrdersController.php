<?php

namespace App\Http\Controllers\Logistics;

use Illuminate\Http\Request;
use App\Models\Sales\MadeToOrders;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LogisticsMTOOrdersController extends Controller
{
    public function index(Request $request){
        $user = Auth::user();

        $query = MadeToOrders::with([
            'user',
            'customers',
            'payments',
            'payments.paymentMethod',
            'stockMovements',
            'discounts',
            'courier',
            'packagingType',
            'items',
            'items.madeToOrderProduct',
        ])
        ->orderBy('created_at', 'desc')->whereIn('status', ['preparing', 'shipped', 'delivered']);

        if ($request->filled('fromDate')) {
            $query->whereDate('created_at', '>=', $request->fromDate);
        }
        if ($request->filled('toDate')) {
            $query->whereDate('created_at', '<=', $request->toDate);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('mto_order_number', 'LIKE', "%{$searchTerm}%")
                ->orWhere('tracking_number', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('customers', function ($q2) use ($searchTerm){
                    $q2->where('first_name', 'LIKE', $searchTerm);
                })
                ->orWhereHas('customers', function ($q3) use ($searchTerm){
                    $q3->where('last_name', 'LIKE', $searchTerm);
                });
            });
        }

        $made_to_orders = $query->paginate(20);
        return inertia('Logistics/MTOOrders/Page', [
            'made_to_orders' => $made_to_orders,
        ]);
    }

    public function show(string $id){
        $made_to_order = MadeToOrders::with([
            'user',
            'customers',
            'payments',
            'payments.paymentMethod',
            'stockMovements',
            'discounts',
            'courier',
            'packagingType',
            'items',
            'items.madeToOrderProduct',
        ])->findOrFail($id);
        return inertia('Logistics/MTOOrders/View/Page', [
            'made_to_order' => $made_to_order,
        ]);
    }

    public function update_status(Request $request, string $id){
        DB::transaction(function() use ($request, $id) {
            $made_to_order = MadeToOrders::findOrFail($id);
        
            // Determine the new status based on the request value
            $updatedStatus = $request->new_status == 'cancel' ? 'cancelled' : $request->new_status;
        
            // Update the record
            $made_to_order->update([
                'status' => $updatedStatus,
            ]);
        });

        return redirect()->route('logistics_mto_orders.index')->with('success', 'Status updated successfully');
    }
}
