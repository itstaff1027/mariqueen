<?php

namespace App\Services\Analytics\Sales;

use Carbon\Carbon;
use App\Models\Sales\SalesOrders;
use App\Models\Sales\SalesOrderItems;
use Illuminate\Support\Facades\DB;
use App\Repositories\Analytics\Sales\SalesAnalyticsRepository;

class SalesAnalyticsService
{
    protected $salesAnalyticsRepository;

    public function __construct(SalesAnalyticsRepository $salesAnalyticsRepository)
    {
        $this->salesAnalyticsRepository = $salesAnalyticsRepository;
    }

    public function getDateRange($preset = null, $startDate = null, $endDate = null)
    {
        $presets = [
            'today'        => [Carbon::today(), Carbon::today()->endOfDay()],
            'yesterday'    => [Carbon::yesterday(), Carbon::yesterday()->endOfDay()],
            'last7'        => [Carbon::today()->subDays(6), Carbon::today()->endOfDay()],
            'this_month'   => [Carbon::today()->startOfMonth(), Carbon::today()->endOfDay()],
            'last_month'   => [Carbon::today()->subMonth()->startOfMonth(), Carbon::today()->subMonth()->endOfMonth()],
            'year_to_date' => [Carbon::today()->startOfYear(), Carbon::today()->endOfDay()],
        ];

        if ($preset) {
            return $presets[$preset] ?? $presets['today'];
        } elseif ($startDate && $endDate) {
            return [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay()
            ];
        }

        return [Carbon::today(), Carbon::today()->endOfDay()];
    }

    public function getSalesAnalytics($from, $to)
    {
        $days = $from->diffInDays($to) + 1;
        $prevEnd = $from->copy()->subDay();
        $prevStart = $prevEnd->copy()->subDays($days - 1);

        $current = $this->salesAnalyticsRepository->getPeriodSales($from, $to);
        $previous = $this->salesAnalyticsRepository->getPeriodSales($prevStart, $prevEnd);

        $trend = $this->calculateTrend($current, $previous);

        return [
            'range' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'sales_current' => $current,
            'sales_previous' => $previous,
            'trend' => $trend,
        ];
    }

    public function getDetailedAnalytics()
    {
        return [
            'monthly_sales' => $this->salesAnalyticsRepository->getMonthlySales(),
            'yearly_sales' => $this->salesAnalyticsRepository->getYearlySales(),
            'daily_sales' => $this->salesAnalyticsRepository->getDailySales(),
            'top_ten_customers' => $this->salesAnalyticsRepository->getTopCustomers(),
            'top_ten_products' => $this->salesAnalyticsRepository->getTopProducts(),
            'top_agents' => $this->salesAnalyticsRepository->getTopAgents(),
        ];
    }

    protected function calculateTrend($current, $previous)
    {
        if ($previous->total_revenue > 0) {
            $pct = ($current->total_revenue - $previous->total_revenue) / $previous->total_revenue * 100;
        } else {
            $pct = null;
        }

        return [
            'type' => is_null($pct) ? 'flat' : ($pct > 0 ? 'up' : 'down'),
            'percent' => round($pct ?? 0, 2)
        ];
    }
}