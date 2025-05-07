<?php

namespace App\Http\Resources\Sales\Stocks;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PointOfSaleStockResources extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // 1) grab the loaded variant
        $variant = $this->productVariant;
        // dd($variant);

        // 2) start merging in every promotion from every “conditionable”
        $allPromos = collect();
        // dd($variant->promotionConditions);
        // variant-level promos
        if ($variant->relationLoaded('promotionConditions') && $variant->promotionConditions) {
            $allPromos = $allPromos->merge(
                $variant->promotionConditions->pluck('promotion')
            );
        }

        // helper to pull in promoConditions->promotion from a related model if loaded
        $pullIn = function(string $relation) use (&$allPromos, $variant) {
            if ($variant->relationLoaded($relation) && $variant->$relation && $variant->$relation->promotionConditions) {
                $allPromos = $allPromos->merge(
                    $variant->$relation->promotionConditions->pluck('promotion')
                );
            }
        };

        // now pull from every other “conditionable”
        $pullIn('colors');
        $pullIn('heelHeights');
        $pullIn('sizes');
        $pullIn('sizeValues');
        $pullIn('categories');
        $pullIn('product');

        // dd($allPromos);

        $allPromos = $allPromos->filter(fn($promo) => $promo->promotion_from == $this->warehouse_id);

        // 3) de-dupe & only keep ones whose .matches() returns true
        $applicable = $allPromos
            ->unique('id')
            ->filter(fn($promo) => $promo->matches($variant))
            ->values();
        // dd($applicable);
        // 4) map to a plain array your React can render
        $promoArray = $applicable->map(fn($promo) => [
            'id'        => $promo->id,
            'name' => $promo->name,
            'type' => $promo->type,
            'discount_value'    => $promo->discount_value,
            'is_active' => $promo->is_active,
            'promotion_from' => $promo->promotion_from,
            'starts_at' => $promo->starts_at,
            'ends_at'    => $promo->ends_at,
        ])->all();
            // dd($promoArray);

        return [
            'id'                  => $this->id,
            'warehouse_id'        => $this->warehouse_id,
            'total_stock'         => (int)$this->total_stock,
            'product_variant_id'  => $this->product_variant_id,

            // ← your single, actionable array ↓
            'promotions'          => $promoArray,

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
            ])
        ];
    }
}
