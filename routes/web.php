<?php

use App\Http\Controllers\Analytics\Sales\SalesAnalyticsController;
use App\Http\Controllers\Inventory\SerialNumberController;
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
use App\Http\Controllers\Sales\MadeToOrderController;
use App\Http\Controllers\Finance\PromotionsController;
use App\Http\Controllers\Inventory\ProductsController;
use App\Http\Controllers\Logistics\CouriersController;
use App\Http\Controllers\Sales\PointOfSalesController;
use App\Http\Controllers\Sales\SalesPaymentController;
use App\Http\Controllers\GlobalSettings\SizeController;
use App\Http\Controllers\Inventory\WarehouseController;
use App\Http\Controllers\GlobalSettings\ColorController;
use App\Http\Controllers\Inventory\StockLevelController;
use App\Http\Controllers\Finance\FinanceOrdersController;
use App\Http\Controllers\Sales\MTOSalesPaymentController;
use App\Http\Controllers\Finance\PaymentMethodsController;
use App\Http\Controllers\GlobalSettings\CategoryController;
use App\Http\Controllers\Inventory\PackagingTypeController;
use App\Http\Controllers\Sales\SalesOrderReturnsController;
use App\Http\Controllers\Finance\DiscountPerItemsController;
use App\Http\Controllers\Finance\FinanceMTOOrdersController;
use App\Http\Controllers\GlobalSettings\OrderTypeController;
use App\Http\Controllers\GlobalSettings\SizeValueController;
use App\Http\Controllers\Inventory\InventoryOrderController;
use App\Http\Controllers\Logistics\LogisticsOrderController;
use App\Http\Controllers\GlobalSettings\HeelHeightController;
use App\Http\Controllers\Inventory\StockTransactionController;
use App\Http\Controllers\Inventory\InventoryMTOOrdersController;
use App\Http\Controllers\Logistics\LogisticsMTOOrdersController;
use App\Http\Controllers\Inventory\MadeToOrderProductsController;
use App\Http\Controllers\Inventory\AssignUserToWarehouseController;
use App\Http\Controllers\Finance\Conditions\PromotionConditionConroller;
use App\Http\Controllers\Inventory\BatchController;

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

Route::middleware(['auth', 'route.authorization'])->group(function () {
    Route::resource('/settings_colors', ColorController::class);
    Route::resource('/settings_categories', CategoryController::class);
    Route::resource('/settings_heel-heights', HeelHeightController::class);
    // Route::resource('/settings_order-types', OrderTypeController::class);
    Route::resource('/settings_sizes', SizeController::class);
    Route::resource('/settings_size_values', SizeValueController::class);
});

Route::middleware(['auth', 'route.authorization'])->group(function () {
    Route::resource('/inventory/products', ProductsController::class);
    Route::post('/inventory/products/variants', [ProductsController::class, 'store_variants']);
    Route::get('/inventory/product/variant/{id}', [ProductsController::class, 'show_product_variant']);

    Route::resource('/inventory_mto_products', MadeToOrderProductsController::class);

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
    Route::post('/inventory/store/stock/transfer', [StockLevelController::class, 'store_transferStock']);
    Route::post('/inventory/store/stock/transfer', [StockLevelController::class, 'store_transferStock']);

    Route::resource('/inventory/warehouses', WarehouseController::class);
    Route::get('/inventory/warehouses/{warehouseId}/ledger', [WarehouseController::class, 'showLedger']);

    Route::resource('/inventory/warehouse/assign_warehouse', AssignUserToWarehouseController::class);

    Route::resource('/inventory_orders', InventoryOrderController::class);
    Route::post('/inventory_orders/update/status/{id}', [InventoryOrderController::class, 'update_status'])->name('inventory_orders.update_status');

    Route::resource('/inventory_mto_orders', InventoryMTOOrdersController::class);
    Route::post('/inventory_mto_orders/update/status/{id}', [InventoryMTOOrdersController::class, 'update_status'])->name('inventory_orders.update_status');

    Route::resource('/inventory_packaging_types', PackagingTypeController::class);

    Route::resource('/inventory/batches', BatchController::class);

    Route::resource('/inventory/serials', SerialNumberController::class);
});

Route::middleware(['auth', 'route.authorization'])->group(function () {
    Route::resource('/customers', CustomersController::class);

    Route::resource('/point_of_sales', PointOfSalesController::class);
    Route::resource('/made_to_orders', MadeToOrderController::class);
    Route::post('/made_to_orders/update/status/{id}', [MadeToOrderController::class, 'update_status']);

    Route::resource('/sales_orders', SalesOrderController::class);
    Route::post('/sales_orders/update/status/{id}', [SalesOrderController::class, 'update_status'])->name('sales_orders.update_status');

    Route::resource('/sales_payments', SalesPaymentController::class);
    Route::post('/sales_payment/upload/images', [SalesPaymentController::class, 'upload_new_images']);
    Route::post('/sales_payment/destroy/image', [SalesPaymentController::class, 'destroy_image']);
    Route::get('/sales_order/{id}', [SalesPaymentController::class, 'get_sales_order']);

    Route::resource('/mto_sales_payments', MTOSalesPaymentController::class);
    Route::post('/mto_sales_payment/upload/images', [MTOSalesPaymentController::class, 'upload_new_images']);
    Route::post('/mto_sales_payment/destroy/image', [MTOSalesPaymentController::class, 'destroy_image']);
    Route::get('/mto_sales_order/{id}', [MTOSalesPaymentController::class, 'get_sales_order']);
    // Route::resource('/sales_payments', SalesPaymentController::class);

    Route::resource('/sales_order_returns', SalesOrderReturnsController::class);
    Route::post('/sales_order_returns/update/status/{id}', [SalesOrderReturnsController::class, 'update_status'])->name('sales_order_return.update-status');
});

Route::middleware(['auth', 'route.authorization'])->group(function () {
    Route::resource('/payment_methods', PaymentMethodsController::class);
    Route::resource('/discounts', DiscountsController::class);

    Route::resource('/discount_per_items', DiscountPerItemsController::class);

    Route::resource('/promotions', PromotionsController::class);
    Route::resource('/promotion_conditions', PromotionConditionConroller::class);

    Route::resource('/finance_orders', FinanceOrdersController::class);
    Route::post('/finance_orders/update/status/{id}', [FinanceOrdersController::class, 'update_status'])->name('finance_orders.update_status');

    Route::resource('/finance_mto_orders', FinanceMTOOrdersController::class);
    Route::post('/finance_mto_orders/update/status/{id}', [FinanceMTOOrdersController::class, 'update_status'])->name('finance_orders.update_status');
});

Route::middleware(['auth', 'route.authorization'])->group(function () {
    Route::resource('/couriers', CouriersController::class);

    Route::resource('/logistics_orders', LogisticsOrderController::class);
    Route::post('/logistics_orders/update/status/{id}', [LogisticsOrderController::class, 'update_status'])->name('logistics_orders.update_status');

    Route::resource('/logistics_mto_orders', LogisticsMTOOrdersController::class);
    Route::post('/logistics_mto_orders/update/status/{id}', [LogisticsMTOOrdersController::class, 'update_status'])->name('logistics_orders.update_status');
});

Route::middleware(['auth', 'route.authorization'])->group(function () {
    Route::get('/sales_analytics', [SalesAnalyticsController::class, 'index'])->name('sales_analytics_dashboard');
});

Route::middleware(['route.authorization'])->group(function () {
    Route::get('/settings', function () {
        return Inertia::render('Settings/Page');
    })->name('settings');
    Route::get('/inventory', function () {
        return Inertia::render('Inventory/Page');
    })->name('inventory');
    Route::get('/finance', function () {
        return Inertia::render('Finance/Page');
    })->name('finance');
    Route::get('/logistics', function () {
        return Inertia::render('Logistics/Page');
    })->name('logistics');
    Route::get('/sales', function () {
        return Inertia::render('Sales/Page');
    })->name('sales');
    Route::get('/analytics', function () {
        return Inertia::render('Analytics/Page');
    })->name('analytics');
});

require __DIR__ . '/auth.php';
