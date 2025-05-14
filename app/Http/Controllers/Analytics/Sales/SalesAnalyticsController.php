<?php

namespace App\Http\Controllers\Analytics\Sales;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Services\Analytics\Sales\SalesAnalyticsService as SalesAnalyticsService;
use App\Http\Resources\Analytics\Sales\SalesResources;

class SalesAnalyticsController extends Controller
{
    protected $salesAnalyticsService;

    public function __construct(SalesAnalyticsService $salesAnalyticsService)
    {
        $this->salesAnalyticsService = $salesAnalyticsService;
    }

    public function index(Request $request)
    {
        // 1) Validation
        $request->validate([
            'preset'     => 'nullable|in:today,yesterday,last7,this_month,last_month,year_to_date',
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date'   => 'nullable|date_format:Y-m-d',
        ]);

        // Check view permission
        $user = Auth::user();
        $hasPermission = $user->roles->flatMap(function ($role) {
            return $role->permissions;
        })->contains(function ($permission) {
            return $permission->name === 'view';
        });

        // Get date range
        [$from, $to] = $this->salesAnalyticsService->getDateRange(
            $request->input('preset'),
            $request->input('start_date'),
            $request->input('end_date')
        );

        // Get analytics data
        $salesAnalytics = $this->salesAnalyticsService->getSalesAnalytics($from, $to);
        $detailedAnalytics = $this->salesAnalyticsService->getDetailedAnalytics();

        // Return to Inertia
        return inertia('Analytics/Sales/Page', array_merge([
            'sales_current'  => SalesResources::make($salesAnalytics['sales_current']),
            'sales_previous' => SalesResources::make($salesAnalytics['sales_previous']),
            'range'          => $salesAnalytics['range'],
            'trend'          => $salesAnalytics['trend'],
            'only_view'      => $hasPermission,
        ], $detailedAnalytics));
    }
}