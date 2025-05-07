<?php

namespace App\Http\Requests\Finance\Conditions;

use Illuminate\Foundation\Http\FormRequest;

class StorePromotionConditionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */

    public function rules(): array
    {
        return [
            'discount_value' => 'required|string',
            'discount_type' => 'required|in:fixed,percentage',
            'conditions' => 'required',
            'promotion_id' => 'required',
            'conditions.*.type' => 'required',
            'conditions.*.id' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'discount_value.required' => 'Discount value is requied, if Fixed:whole number, if Percentage: decimal',
            'discount_type.required' => 'It should be Fixed or Percentage onyl!',
            'conditions.required' => 'Conditions Cannot be Empty!',
            'conditions.*.type.required' => 'Please REMOVE an empty Conditional type if theres no conditions',
            'conditions.*.id.required' => 'Please REMOVE an empty Conditional id if theres no conditions',
            'promotion_id.required' => 'Promotion ID is required!',
        ];
    }
}
