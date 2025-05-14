<?php

namespace App\Http\Resources\Analytics\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // dd($request);
        return [
            'total_revenue' => $this->total_revenue ?? 0,
            'total_shipping_fee' => $this->total_shipping_fee ?? 0,
            'total_rush_fee' => $this->total_rush_fee ?? 0,
            'total_balance' => - ($this->total_balance) ?? 0,
            'total_excess' => $this->total_excess ?? 0,
            'date' => $this->date ?? null,
            'month' => $this->month ?? null,
            'year' => $this->year ?? null,
        ];
    }
}
