<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\Sales\CustomersController;
use App\Http\Controllers\Sales\DiscountsController;
use App\Http\Controllers\Sales\SalesOrderController;
use App\Http\Controllers\Inventory\ProductsController;
use App\Http\Controllers\Logistics\CouriersController;
use App\Http\Controllers\Sales\PointOfSalesController;
use App\Http\Controllers\GlobalSettings\SizeController;
use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\GlobalSettings\ColorController;
use App\Http\Controllers\Inventory\StockLevelController;
use App\Http\Controllers\Finance\FinanceOrdersController;
use App\Http\Controllers\Finance\PaymentMethodsController;
use App\Http\Controllers\GlobalSettings\CategoryController;
use App\Http\Controllers\GlobalSettings\OrderTypeController;
use App\Http\Controllers\GlobalSettings\SizeValueController;
use App\Http\Controllers\GlobalSettings\HeelHeightController;
use App\Http\Controllers\Inventory\StockTransactionController;
use App\Http\Controllers\Inventory\AssignUserToWarehouseController;

Route::get('/', function () {
    return Redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('/settings_colors', ColorController::class);
    Route::resource('/settings_categories', CategoryController::class);
    Route::resource('/settings_heel-heights', HeelHeightController::class);
    // Route::resource('/settings_order-types', OrderTypeController::class);
    Route::resource('/settings_sizes', SizeController::class);
    Route::resource('/settings_size_values', SizeValueController::class);

});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('/inventory/products', ProductsController::class);
    Route::post('/inventory/products/variants', [ProductsController::class, 'store_variants']);
    Route::get('/inventory/product/variant/{id}', [ProductsController::class, 'show_product_variant']);
    
    // Route::post('/inventory/product/front_image/upload', [ProductsController::class, 'update_front_image']);
    // Route::post('/inventory/product/gallery_images/upload', [ProductsController::class, 'update_gallery_images']);
    // Route::post('/inventory/product/gallery_images/update_colors', [ProductsController::class, 'assign_color_images']);
    // Route::post('/inventory/product/gallery_image/delete', [ProductsController::class, 'destroy_gallery_image']);

    Route::resource('/inventory/stocks', StockLevelController::class);

    Route::resource('/inventory/stock/transactions', StockTransactionController::class);
    Route::post('/inventory/stock/transactions/pending/{id}', [StockTransactionController::class, 'update_status_to_pending'])->name('to_pending');
    Route::post('/inventory/stock/transactions/approve/{id}', [StockTransactionController::class, 'update_status_to_approved'])->name('test');
    Route::post('/inventory/stock/transactions/reject/{id}', [StockTransactionController::class, 'update_status_to_rejected'])->name('to_rejected');
    Route::get('/inventory/stock_movements/{id}', [StockTransactionController::class, 'get_stock_movements'])->name('stock_movements');
    
    Route::get('/inventory/stock/transfer', [StockLevelController::class, 'transfer_stocks']);
    Route::post('/inventory/store/stock/transfer', [StockLevelController::class, 'store_transferStock']);Route::post('/inventory/store/stock/transfer', [StockLevelController::class, 'store_transferStock']);
    
    Route::resource('/inventory/warehouses', WarehouseController::class);
    Route::get('/inventory/warehouses/{warehouseId}/ledger', [WarehouseController::class, 'showLedger']);



    Route::resource('/inventory/warehouse/assign_warehouse', AssignUserToWarehouseController::class);
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('/customers', CustomersController::class);
    Route::resource('/discounts', DiscountsController::class);

    Route::resource('/point_of_sales', PointOfSalesController::class);

    Route::resource('/sales_orders', SalesOrderController::class);
    Route::post('/sales_orders/update/status/{id}', [SalesOrderController::class, 'update_status'])->name('sales_orders.update_status');

});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('/payment_methods', PaymentMethodsController::class);

    // Route::resource('/finance_orders', FinanceOrdersController::class);

});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('/couriers', CouriersController::class);

});

Route::middleware(['auth', 'role:admin'])->group(function (){
    Route::get('/settings', function () {
        return Inertia:: render('Settings/Page');
    })->name('settings');
    Route::get('/inventory', function () {
        return Inertia:: render('Inventory/Page');
    })->name('inventory');
    Route::get('/sales', function () {
        return Inertia:: render('Sales/Page');
    })->name('sales');
    Route::get('/finance', function () {
        return Inertia:: render('Finance/Page');
    })->name('finance');
    Route::get('/logistics', function () {
        return Inertia:: render('Logistics/Page');
    })->name('logistics');
});

require __DIR__.'/auth.php';
