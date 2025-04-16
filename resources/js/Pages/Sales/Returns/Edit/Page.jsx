import React, { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Textarea } from '@headlessui/react';

const EditSalesOrderReturn = ({ sales_order_return, warehouses }) => {
    // Initialize order items and add a returnQuantity field.
    const [orderItems, setOrderItems] = useState(
        sales_order_return?.reference_order.items?.map(item => ({
            ...item,
            returnQuantity: item.quantity, // default to full quantity; adjust as needed
        })) || []
    );

    const [originalReturnItems, setOriginalReturnItems] = useState(sales_order_return?.return_items)

    const { data, setData, put, errors } = useForm({
        sales_order_id: sales_order_return.reference_order?.id || '',
        sales_order_number: sales_order_return.reference_order?.order_number || '',
        items: [],
        return_date: sales_order_return.return_date || new Date().toISOString().split('T')[0] || '', // produces "2025-04-07"
        warehouse_id: sales_order_return.warehouse_id || '',
        remarks: sales_order_return.remarks || '',
    });

    // Remove an item from the order items list.
    const handleRemoveItem = (itemId) => {
        setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // Update the return quantity for a specific item.
    // This function clamps the new quantity to not exceed the original quantity.
    const handleQuantityChange = (itemId, newQuantity) => {
        setOrderItems(prevItems =>
            prevItems.map(item => {
                if (item.id === itemId) {
                    const allowedQuantity = item.quantity; // original sold quantity
                    // Clamp the value: if newQuantity exceeds allowedQuantity, use allowedQuantity instead.
                    const clampedQuantity = newQuantity > allowedQuantity ? allowedQuantity : newQuantity;
                    return { ...item, returnQuantity: clampedQuantity };
                }
                return item;
            })
        );
    };

    const handleSubmit = () => {
        console.log(data);
        put(`/sales_order_returns/${sales_order_return.id}`)
    };

    // Sync updated orderItems with the form data.
    useEffect(() => {
        setData('items', orderItems);
        console.log(sales_order_return)
    }, [orderItems]);


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold text-gray-800">
                    Create Order Return
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-8 shadow-lg">
                        {/* Order Number Search */}
                        <div className="relative mb-8">
                            <InputLabel
                                htmlFor="order_number"
                                value="Order Number"
                            />
                            <TextInput
                                id="order_number"
                                name="order_number"
                                value={data.sales_order_number}
                                disabled
                                placeholder="Search Order Number..."
                                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-8">
                            <InputLabel
                                htmlFor="return_date"
                                value="Return Date (YYYY-MM-DD)"
                            />
                            <TextInput
                                id="return_date"
                                name="return_date"
                                value={data.return_date}
                                onChange={(e) => {
                                    setData('return_date', e.target.value);
                                }}
                                placeholder="Return Date"
                                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <InputError message={errors.return_date} />
                        </div>

                        <div className="mb-8">
                            <InputLabel
                                htmlFor="warehouse_id"
                                value="Select Warehouse"
                            />
                            <select
                                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="warehouse_id"
                                name="warehouse_id"
                                value={data.warehouse_id}
                                onChange={(e) => {
                                    setData('warehouse_id', e.target.value);
                                }}
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses.map((wh) => (
                                    <option value={wh.id}>{wh.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.warehouse_id} />
                        </div>

                        {/* Order Items Table */}
                        <div className="overflow-x-auto mb-8">
                            <h1>Adjust Here</h1>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Item
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Return Qty
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orderItems?.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                {item.id}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                {
                                                    item.product_variant.product
                                                        .product_name
                                                }{' '}
                                                –{' '}
                                                {
                                                    item.product_variant.colors
                                                        .color_name
                                                }{' '}
                                                – Size:{' '}
                                                {parseInt(
                                                    item.product_variant
                                                        .size_values
                                                        .size_values,
                                                )}{' '}
                                                – Heel:{' '}
                                                {
                                                    item.product_variant
                                                        .heel_heights.value
                                                }
                                                "
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={item.quantity} // HTML attribute to restrict input
                                                    value={item.returnQuantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            item.id,
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="w-20 rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.id,
                                                        )
                                                    }
                                                    className="inline-flex items-center rounded-md bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {orderItems.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No items to display.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Order Items Table */}
                        <div className="overflow-x-auto mb-8">
                            <h1>Reference</h1>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Item
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Returned Qty
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {originalReturnItems?.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                {item.id}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                {
                                                    item.sales_order_items.product_variant.product
                                                        .product_name
                                                }{' '}
                                                –{' '}
                                                {
                                                    item.sales_order_items.product_variant.colors
                                                        .color_name
                                                }{' '}
                                                – Size:{' '}
                                                {parseInt(
                                                    item.sales_order_items.product_variant
                                                        .size_values
                                                        .size_values,
                                                )}{' '}
                                                – Heel:{' '}
                                                {
                                                    item.sales_order_items.product_variant
                                                        .heel_heights.value
                                                }
                                                "
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                    {orderItems.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-4 text-center text-sm text-gray-500"
                                            >
                                                No items to display.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <InputLabel htmlFor="remarks" value="Remarks" />
                            <Textarea
                                id="remarks"
                                name="remarks"
                                value={data.remarks}
                                onChange={(e) => {
                                    setData('remarks', e.target.value);
                                }}
                                placeholder="Remarks/Note/Reasons..."
                                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <InputError message={errors.remarks} />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-md bg-blue-500 px-6 py-3 text-base font-semibold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                onClick={handleSubmit}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditSalesOrderReturn;
