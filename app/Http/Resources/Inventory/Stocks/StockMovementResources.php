<?php

namespace App\Http\Resources\Inventory\Stocks;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockMovementResources extends JsonResource
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
            'product_variant_id' => $this->product_variant_id,
            $this->mergeWhen($this->productVariant, [
                'product_sku' => $this->productVariant->sku,
                'unit_price' => $this->productVariant->unit_price,
                'cost' => $this->productVariant->cost,
                'product_id' => $this->productVariant->product_id,
                $this->mergeWhen($this->productVariant->product, [
                    'product_name' => $this->productVariant->product->product_name,
                ]),
                $this->mergeWhen($this->productVariant->colors, [
                    'color_name' => $this->productVariant->colors->color_name,
                ]),
                $this->mergeWhen($this->productVariant->heelHeights, [
                    'heel_height' => $this->productVariant->heelHeights->value,
                ]),
                $this->mergeWhen($this->productVariant->sizes, [
                    'size_name' => $this->productVariant->sizes->size_name,
                ]),
                $this->mergeWhen($this->productVariant->size_values, [
                    'size_value' => $this->productVariant->size_values->size_values,
                ]),
                $this->mergeWhen($this->productVariant->categories, [
                    'category' => $this->productVariant->categories->category_name,
                ]),
            ]),
            'from_warehouse_id' => $this->from_warehouse_id,
            'from_warehouse' => $this->whenLoaded('warehouse', function() {
                return [
                    'id' => $this->warehouse->id,
                    'warehouse_name' => $this->warehouse->warehouse_name,
                ];
            }),
            'to_warehouse_id' => $this->to_warehouse_id,
            'to_warehouse' => $this->whenLoaded('warehouse', function() {
                return [
                    'id' => $this->warehouse->id,
                    'warehouse_name' => $this->warehouse->warehouse_name,
                ];
            }),
            'movement_type' => $this->movement_type,
            'warehouse_id' => ($this->movement_type == 'transfer_out' || $this->movement_type == 'sale') ? $this->from_warehouse_id : $this->to_warehouse_id,
            'quantity' => $this->quantity,
            'remarks' => $this->remarks,
            'stock_transaction_id' => $this->stock_transaction_id,
            'sales_transaction_id' => $this->sales_transaction_id,
            'created_at' => $this->created_at->format('d M Y H:i'),
        ];
    }
}
