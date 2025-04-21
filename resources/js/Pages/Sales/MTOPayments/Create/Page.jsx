import React, { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import axios from 'axios';
import { Textarea } from '@headlessui/react';

const CreatedMTOSalesPayment = ({ mto_sales_orders, payment_methods }) => {
    const { data, setData, post, errors } = useForm({
        sales_order_id: '',
        order_number: '',            // selected order number
        payment_method_id: '',       // selected payment method
        status: '',                  // selected status
        payment_amount: '',          // client amount paid
        grand_total: 0,              // grand total from selected sales order
        balance: 0,                  // computed as payment_amount - grand_total
        remarks: '',
        type_purpose: 'Balance',
        images: []
    });

    // State for order search and controlling dropdown visibility
    const [orderSearch, setOrderSearch] = useState("");
    const [showOrderDropdown, setShowOrderDropdown] = useState(false);
    const [salesOrder, setSalesOrder] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Update balance whenever payment_amount or grand_total changes.
    // useEffect(() => {
    //     const payment = parseFloat(data.payment_amount) || 0;
    //     const grandTotal = parseFloat(data.grand_total) || 0;
    //     setData('balance', payment - grandTotal);
    // }, [data.payment_amount, data.grand_total]);

    // Filter orders based on the search query.
    const filteredSalesOrders = mto_sales_orders.filter(order =>
        order.mto_order_number.toLowerCase().includes(orderSearch.toLowerCase())
    );

    // When an order is selected from the dropdown.
    const handleOrderSelect = (order) => {
        setData('order_number', order.mto_order_number);
        setOrderSearch(order.mto_order_number);
        setShowOrderDropdown(false);
        // Fetch additional details for this order (e.g., grand_total)
        axios.get(`/mto_sales_order/${order.id}`)
            .then(response => {
                setSalesOrder(response.data);
                console.log(response.data)
                // Assume the response returns a 'grand_amount' field.
                setData('grand_total', response.data.grand_amount);
                setData('sales_order_id', response.data.id)
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
            });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        setSelectedFiles(files);
    };

    const removeFile = (indexToRemove) => {
        // Filter out the file at the specified index
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);
        setData('images', updatedFiles);
    };

    const createPayment = (e) => {
        e.preventDefault();
        console.log(data);
        post(`/mto_sales_payments`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Sales Payment
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
                    <div>
                        {/* Order Number Input with Autocomplete Dropdown */}
                        <div className="relative mb-6">
                            <InputLabel
                                for="order_number"
                                value="Order Number"
                            />
                            <TextInput
                                id="order_number"
                                name="order_number"
                                value={orderSearch}
                                onChange={(e) => {
                                    setOrderSearch(e.target.value);
                                    setShowOrderDropdown(true);
                                }}
                                onFocus={() => setShowOrderDropdown(true)}
                                className="w-full rounded border p-2"
                                placeholder="Search Order Number..."
                            />
                            <InputError message={errors.order_number} />
                            {showOrderDropdown &&
                                filteredSalesOrders.length > 0 && (
                                    <ul className="absolute z-10 max-h-60 w-full overflow-y-auto rounded border bg-white">
                                        {filteredSalesOrders.map((order) => (
                                            <li
                                                key={order.id}
                                                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                                onClick={() =>
                                                    handleOrderSelect(order)
                                                }
                                            >
                                                {order.mto_order_number}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <InputLabel
                                for="payment_method_id"
                                value="Payment Method"
                            />
                            <select
                                id="payment_method_id"
                                value={data.payment_method_id}
                                onChange={(e) =>
                                    setData('payment_method_id', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            >
                                <option value="">Select Payment Method</option>
                                {payment_methods.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.payment_method_id} />
                        </div>

                        {/* Status Dropdown */}
                        <div className="mb-6">
                            <InputLabel for="status" value="Status" />
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            >
                                <option value="">Select Status</option>
                                <option value="paid">Paid</option>
                                <option value="partial">Partial</option>
                            </select>
                            <InputError message={errors.status} />
                        </div>

                        <div className="mb-6">
                            <InputLabel for="type_purpose" value="Purpose" />
                            <select
                                id="type_purpose"
                                value={data.type_purpose}
                                onChange={(e) =>
                                    setData('type_purpose', e.target.value)
                                }
                                className="w-full rounded border p-2"
                            >
                                <option value="">Select purpose</option>
                                <option value="balance">Balance</option>
                                <option value="additional">Additional</option>
                            </select>
                            <InputError message={errors.type_purpose} />
                        </div>

                        {/* Client Payment Amount */}
                        <div className="mb-6">
                            <InputLabel
                                for="payment_amount"
                                value="Client Payment Amount"
                            />
                            <TextInput
                                id="payment_amount"
                                type="number"
                                value={data.payment_amount}
                                onChange={(e) =>
                                    setData('payment_amount', e.target.value)
                                }
                                className="w-full"
                            />
                            <InputError message={errors.payment_amount} />
                        </div>

                        {/* Grand Total (Read-Only) */}
                        <div className="mb-6">
                            <InputLabel for="grand_total" value="Grand Total" />
                            <TextInput
                                id="grand_total"
                                type="number"
                                value={salesOrder?.grand_amount}
                                disabled
                                className="w-full bg-gray-100"
                            />
                        </div>

                        {/* Computed Balance (Read-Only) */}
                        <div className="mb-6">
                            <InputLabel for="balance" value="Balance" />
                            <TextInput
                                id="balance"
                                type="number"
                                value={salesOrder?.balance}
                                disabled
                                className="w-full bg-gray-100"
                            />
                        </div>

                        {/* Computed Balance (Read-Only) */}
                        <div className="mb-6">
                            <InputLabel for="remarks" value="Remarks" />
                            <Textarea
                                className="w-full rounded border p-2"
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                            />
                        </div>

                        <div>
                        <h1 className="text-2xl font-bold mb-4">Upload Payment Images (Multiple Allowed)</h1>
                                    <input
                                        type="file"
                                        name="new_images"
                                        multiple
                                        onChange={handleFileChange}
                                        className="border p-2 rounded"
                                    />
                                    {errors.new_images && (
                                        <div className="text-red-500 mt-2">{errors.new_images}</div>
                                    )}

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4">
                                            <h2 className="text-lg font-bold">Selected Files:</h2>
                                            <ul className="list-disc list-inside">
                                                {selectedFiles.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-gray-700 flex items-center justify-between"
                                                    >
                                                        {file.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 ml-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                        </div>

                        <button
                            type="submit"
                            onClick={createPayment}
                            className="focus:shadow-outline rounded bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-emerald-700 focus:outline-none"
                        >
                            Create Sales Payment
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreatedMTOSalesPayment;
