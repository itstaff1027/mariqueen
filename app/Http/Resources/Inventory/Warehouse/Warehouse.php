<?php

namespace App\Http\Resources\Inventory\Warehouse;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Warehouse extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
