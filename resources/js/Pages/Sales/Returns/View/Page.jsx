import React, { useEffect, useState } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Textarea } from '@headlessui/react';
import ActionsDropdown from '@/Components/ActionsDropdown';

const ViewSalesOrderReturn = ({ sales_order_return }) => {
    const [statuses, setStatuses] = useState([]);
    // Initialize order items and add a returnQuantity field.
    const [orderItems, setOrderItems] = useState(
        sales_order_return?.reference_order.items?.map(item => ({
            ...item,
            returnQuantity: item.quantity, // default to full quantity; adjust as needed
        })) || []
    );

    const { auth } = usePage().props;

    const [originalReturnItems, setOriginalReturnItems] = useState(sales_order_return?.return_items)

    const handleSubmit = () => {
        console.log(data);
        put(`/sales_order_returns/${sales_order_return.id}`)
    };

    // Sync updated orderItems with the form 
    // useEffect(() => {
    //     console.log(auth);
    // }, [orderItems]);

    useEffect(() => {
        setStatuses(allowedStatuses(auth.user));
    }, [auth.user]);

    const allowedStatuses = (user) => {
        // const statuses = [];
        // Flatten the permissions from all roles into one array
        const allPermissions = user.roles.flatMap(role => role.permissions);
        const statuses = [];
        if (allPermissions.some(perm => perm.name === 'update' && sales_order_return.status !== 'cancelled'  && sales_order_return.status !== 'complete')) {
            statuses.push('pending', 'processing', 'complete');
        }
        if (allPermissions.some(perm => perm.name === 'cancel')) {
            statuses.push('cancel');
        }
        return statuses;
    };

    const updateStatus = (status) => {
        if (
            confirm(
                `Are you sure you want to update the order status to ${status}?`,
            )
        ) {
            const newStatus = status;
            router.post(`/sales_order_returns/update/status/${sales_order_return.id}`, { new_status: newStatus})
            // console.log(newStatus);
        }
    }


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
                        {/* Insert the dropdown menu in the top area */}
                        <div className="mb-4 flex justify-between w-full">
                            <h1>Current Status: <u>{sales_order_return.status}</u></h1>
                            <ActionsDropdown states={statuses} onSelectStatus={(state) => updateStatus(state)} />
                        </div>
                        <div className="relative mb-8">
                            <InputLabel
                                htmlFor="order_number"
                                value="Order Number"
                            />
                            <TextInput
                                id="order_number"
                                name="order_number"
                                value={sales_order_return.reference_order.order_number}
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
                                value={sales_order_return.return_date}
                                disabled
                                placeholder="Return Date"
                                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="mb-8">
                            <InputLabel
                                htmlFor="warehouse_id"
                                value="Select Warehouse"
                            />
                            <input
                                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="warehouse_id"
                                name="warehouse_id"
                                value={sales_order_return.warehouse.name}
                                disabled
                            />
                        </div>

                        {/* Order Items Table */}
                        <div className="overflow-x-auto mb-8">
                            <h1>Original</h1>
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
                                            For Return Qty
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
                                value={sales_order_return.remarks}
                                disabled
                                placeholder="Remarks/Note/Reasons..."
                                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ViewSalesOrderReturn;
