<?php

namespace App\Http\Requests\Finance;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePromotionRequest extends FormRequest
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
            'promotion_name'  => 'required|string|max:255',
            'type'            => 'required|in:bundle,bogo,discount',
            'discount_value'  => 'nullable|numeric|min:0',
            'starts_at'  => 'required|date',
            'ends_at'    => 'required|date|after_or_equal:starts_at',
            'is_active'       => 'required|boolean',
            'promotion_from' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'promotion_name.required' => 'You have to give this promo a name.',
            'type.in'                 => 'Type must be one of bundle, bogo, or discount.',
            'type.required' => 'Type must be one of bundle, bogo, or discount.',
            'discount_value.numeric' => 'Discount value must be a number.',
            'starts_at.required' => 'You must set a Date for this promo.',
            'starts_at.date' => 'This must be a date Format: YYYY-DD-MM.',
            'ends_at.required' => 'You must set the End Date for this promo.',
            'ends_at.date' => 'This must be a date Format: YYYY-DD-MM.',
            'promotion_from.required' => 'Please choose which Sales are in Promo.',
        ];
    }
}
