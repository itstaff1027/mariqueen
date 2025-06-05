<?php

namespace App\Http\Requests\Inventory\StockTransactions;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class StoreStockTransactions extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user() || false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transaction_type' => 'required|in:purchase,return,adjustment,correction,repair,transfer',
            'remarks' => 'nullable|string|max:255',
            'products' => 'required|array',
            'products.*.product_variant_id' => 'required|exists:product_variants,id',
            'products.*.quantity' => 'required|integer|min:1',
            'from_warehouse_id' => 'required_if:transaction_type,transfer',
            'to_warehouse_id' => 'required|exists:warehouses,id',
        ];
    }

    public function messages(): array
    {
        return [
            'transaction_type.required' => 'Please choose a Transaction Type.',
            'transaction_type.in' => 'Transaction Type is invalid!',
            'remarks.max' => 'Remarks is too long! Maximum characters is only 255.',
            'products.array' => 'Products is invalid!',
            'products.required' => 'Products is required!',
            'products.*.product_variant_id.required' => 'Product Variant is required!',
            'products.*.product_variant_id.exists' => 'Product Variant cannot find!',
            'products.*.quantity.required' => 'Quantity is required!',
            'products.*.quantity.integer' => 'Quantity must be an integer!',
            'products.*.quantity.min' => 'Quantity must be greater than 0!',
            'to_warehouse_id.exists' => 'From Warehouse can not find!',
            'to_warehouse_id.required' =>'Please choose a Warehouse!',
            'from_warehouse_id.required_if' => 'Source Warehouse is required when Transaction Type is transfer!',
        ];
    }
}
