<?php

namespace App\Http\Resources\Finance\Conditions;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionConditionResources extends JsonResource
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
            'conditional_type' => $this->conditional_type,
            'conditional_id' => $this->conditional_id,
            $this->mergeWhen($this->conditional_type == 'product', [
                'conditional_value' => $this->whenLoaded('product', function () {
                    return [
                        'id' => $this->product->id,
                        'name' => $this->product->product_name
                    ];
                })
            ]),
            $this->mergeWhen($this->conditional_type == 'color', [
                'conditional_value' => $this->whenLoaded('color', function () {
                    return [
                        'id' => $this->color->id,
                        'name' => $this->color->color_name
                    ];
                })
            ]),
            $this->mergeWhen($this->conditional_type == 'heel_height', [
                'conditional_value' => $this->whenLoaded('heelHeight', function () {
                    return [
                        'id' => $this->heelHeight->id,
                        'name' => $this->heelHeight->value
                    ];
                })
            ]),
            $this->mergeWhen($this->conditional_type == 'category', [
                'conditional_value' => $this->whenLoaded('category', function () {
                    return [
                        'id' => $this->category->id,
                        'name' => $this->category->category_name
                    ];
                })
            ]),
        ];
    }
}
