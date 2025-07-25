<?php

namespace App\Http\Requests\Inventory\Batches;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateBatchRequest extends FormRequest
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
            'batch_id' => 'required',
            'manufacturing_date' => 'required',
            'expiry_date' => 'required|date',
            'received_date' => 'nullable|date',
            'description' => 'nullable|string|max:1000',
            'warehouse_id' => 'required|exists:warehouses,id',
        ];
    }

    public function messages(): array
    {
        return [
            'batch_id.required' => 'Batch ID is Required, cannot proceed without Batch Id',
            'manufacturing_date.required' => 'Please input a Manufacturing date',
            'expiry_date.required' => 'Please input a Expiration Date',
            'received_date.date' => 'Received Date is invalid!',
            'manufacturing_date.date' => 'Manufacturing Date is invalid!',
            'expiry_date.date' => 'Expiration Date is invalid!',
            'description.string' => 'User\'s input is invalid!',
            'description.max' => 'Description character limit is only 1000!',
            'warehouse_id.required' => 'Please Choose a Warehouse!'
        ];
    }
}
