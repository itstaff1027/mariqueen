<?php

namespace App\Http\Resources\Finance;

use App\Http\Resources\Inventory\Warehouse\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Inventory\Warehouse\WarehouseResource;

class Promotions extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'discount_value' => $this->discount_value,
            'is_active' => $this->is_active,
            'promotion_from' => $this->promotion_from,
            // 'warehouse' => $this->load('promotionFrom'),
            'warehouse' => $this->whenLoaded('promotionFrom',function() {
                return [
                    'id' => $this->promotionFrom->id,
                    'name' => $this->promotionFrom->name
                ];
            }),
            // 'location' => $location,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
        ];
    }

    public function with($request): array  {
        return [
            'meta' => [
                'api_version' => '1.0',
                'success'     => true,
            ],
        ];
    }
}
