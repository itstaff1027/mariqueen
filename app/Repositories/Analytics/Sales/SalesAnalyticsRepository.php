<?php

namespace App\Repositories\Analytics\Sales;

use Carbon\Carbon;
use App\Models\Sales\SalesOrders;
use App\Models\Sales\SalesOrderItems;
use Illuminate\Support\Facades\DB;

class SalesAnalyticsRepository
{
    protected $fields = "
        SUM(total_amount)   AS total_revenue,
        SUM(shipping_cost)  AS total_shipping_fee,
        SUM(rush_order_fee) AS total_rush_fee,
        SUM(balance)        AS total_balance,
        SUM(excess)         AS total_excess
    ";

    public function getPeriodSales($from, $to)
    {
        return SalesOrders::selectRaw($this->fields)
            ->whereBetween('created_at', [$from, $to])
            ->first();
    }

    public function getDailySales()
    {
        return SalesOrders::selectRaw("
            SUM(total_amount)   AS total_revenue,
            SUM(shipping_cost)  AS total_shipping_fee,
            SUM(rush_order_fee) AS total_rush_fee,
            SUM(balance)        AS total_balance,
            SUM(excess)         AS total_excess,
            DATE(created_at) as date
        ")
            ->whereMonth('created_at', Carbon::now()->month)
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get();
    }

    public function getMonthlySales()
    {
        return SalesOrders::selectRaw("
            SUM(total_amount)   AS total_revenue,
            SUM(shipping_cost)  AS total_shipping_fee,
            SUM(rush_order_fee) AS total_rush_fee,
            SUM(balance)        AS total_balance,
            SUM(excess)         AS total_excess,
            MONTH(created_at) as month
        ")
            ->whereYear('created_at', Carbon::now()->year)
            ->groupByRaw('MONTH(created_at)')
            ->orderByRaw('MONTH(created_at)')
            ->get();
    }

    public function getYearlySales()
    {
        return SalesOrders::selectRaw("
            SUM(total_amount)   AS total_revenue,
            SUM(shipping_cost)  AS total_shipping_fee,
            SUM(rush_order_fee) AS total_rush_fee,
            SUM(balance)        AS total_balance,
            SUM(excess)         AS total_excess,
            YEAR(created_at) as year
        ")
            ->groupByRaw('YEAR(created_at)')
            ->orderByRaw('YEAR(created_at)')
            ->get();
    }

    public function getTopCustomers()
    {
        return SalesOrders::with(['customers', 'user'])
            ->whereYear('created_at', Carbon::now()->year)
            ->select('customer_id', DB::raw('COUNT(*) as total_purchases'))
            ->groupBy('customer_id')
            ->orderByDesc('total_purchases')
            ->limit(10)
            ->get();
    }

    public function getTopProducts()
    {
        return SalesOrderItems::with(['productVariant', 'productVariant.product'])
            ->whereMonth('created_at', Carbon::now()->month)
            ->selectRaw('sales_order_items.product_variant_id, SUM(sales_order_items.quantity) as total_quantity')
            ->groupBy('sales_order_items.product_variant_id')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();
    }

    public function getTopAgents()
    {
        return SalesOrders::with(['user'])
            ->whereMonth('created_at', Carbon::now()->month)
            ->selectRaw('sales_orders.user_id, SUM(sales_orders.total_amount) as total_sales')
            ->groupBy('sales_orders.user_id')
            ->orderByDesc('total_sales')
            ->get();
    }
}