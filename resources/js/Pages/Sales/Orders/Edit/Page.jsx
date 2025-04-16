import React, { useEffect, useState } from 'react';
import { Link, router , usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Textarea } from '@headlessui/react';
import InputError from '@/Components/InputError';

const SalesOrderView = ({ sales_order }) => {

    const { data, setData, put, errors } = useForm({
        remarks: sales_order.remarks,
        
    });

    const handleUpdate = (e) => {
        e.preventDefault();

        put(`/point_of_sales/${sales_order.id}`);
    }

    useEffect(() => {
        // console.log(products);
        console.log(sales_order)
    }, [sales_order]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {sales_order.order_number}
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-md">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="flex flex-col justify-center items-center w-full p-10">
                                    
                                    <div className="grid grid-cols-2 w-full">
                                        <h1 className="text-3xl font-bold w-full text-left">Order Date: <u>{formatDate(sales_order.created_at)}</u></h1>
                                        <h1 className="text-3xl font-bold w-full text-right">Status: <u>{sales_order.status.toUpperCase()}</u></h1>
                                    </div>

                                    <div className="grid grid-cols-2 w-full">
                                        <h1 className="text-2xl font-bold w-full text-left">Courier: <u>{sales_order.courier.name.toUpperCase()}</u></h1>
                                        <h1 className="text-2xl font-bold w-full text-right">Packaging Type: <u>{sales_order.packaging_type?.packaging_name.toUpperCase()}</u></h1>
                                    </div>
                                    <div className="grid grid-cols-2 w-full">
                                        <h1 className="text-2xl font-bold w-full text-left">Shoulder By: <u>{sales_order.shoulder_by.toUpperCase()}</u></h1>
                                    </div>

                                    <div className="my-4 w-full">
                                        <h2 className="text-xl font-semibold mb-2">Order Items</h2>
                                        <table className="min-w-full border border-gray-300">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border px-4 py-2 text-left">SKU</th>
                                                    {/* <th className="border px-4 py-2 text-left">Description</th> */}
                                                    <th className="border px-4 py-2 text-right">Quantity</th>
                                                    <th className="border px-4 py-2 text-right">Unit Price</th>
                                                    <th className="border px-4 py-2 text-right">Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sales_order.items && sales_order.items.length > 0 ? (
                                                    sales_order.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="border px-4 py-2">{item.product_variant.sku}</td>
                                                            {/* <td className="border px-4 py-2">
                                                                {item.product_variant}
                                                            </td> */}
                                                            <td className="border px-4 py-2 text-right">{item.quantity}</td>
                                                            <td className="border px-4 py-2 text-right">
                                                                ₱{parseFloat(item.unit_price).toFixed(2)}
                                                            </td>
                                                            <td className="border px-4 py-2 text-right">
                                                                ₱{parseFloat(item.total_price).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td className="border px-4 py-2 text-center" colSpan="5">
                                                            No items found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="w-full mb-4">
                                        <p className="text-l font-bold w-full">Packaging Type Description: <u>{sales_order.packaging_type?.description}</u></p>
                                    </div>

                                    <div className="mb-4 w-full">
                                        <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
                                        <table className="min-w-full border border-gray-300">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border px-4 py-2 text-left">Payment Method</th>
                                                    <th className="border px-4 py-2 text-left">Amount Paid</th>
                                                    <th className="border px-4 py-2 text-left">Change Due</th>
                                                    <th className="border px-4 py-2 text-right">Excess</th>
                                                    <th className="border px-4 py-2 text-right">Balance</th>
                                                    <th className="border px-4 py-2 text-right">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sales_order.payments && sales_order.payments.length > 0 ? (
                                                    sales_order.payments.map((payment) => (
                                                        <tr key={payment.id}>
                                                            <td className="border px-4 py-2">{payment.payment_method.name}</td>
                                                            <td className="border px-4 py-2">₱{payment.amount_paid}</td>
                                                            <td className="border px-4 py-2 text-right">₱{payment.change_due}</td>
                                                            <td className="border px-4 py-2 text-right">
                                                                ₱{payment.excess_amount}
                                                            </td>
                                                            <td className="border px-4 py-2 text-right">
                                                                ₱{payment.remaining_balance}
                                                            </td>
                                                            <td className="border px-4 py-2 text-right">
                                                                {formatDate(payment.created_at)}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td className="border px-4 py-2 text-center" colSpan="5">
                                                            No items found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="w-full p-4">
                                        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
                                        {sales_order.customers ? (
                                        <div>
                                            <p className="text-gray-700">
                                                {sales_order.customers.first_name} {sales_order.customers.last_name}
                                            </p>
                                            <p className="text-gray-700">Email: {sales_order.customers.email}</p>
                                            <p className="text-gray-700">Phone: {sales_order.customers.phone}</p>
                                            <p className="text-gray-700">Address: {sales_order.customers.address}</p>
                                                {sales_order.customers.receiver_name && (
                                            <p className="text-gray-700">
                                                Receiver: {sales_order.customers.receiver_name}
                                            </p>
                                            )}
                                        </div>
                                        ) : (
                                            <p className="text-gray-700">No customer information available.</p>
                                        )}
                                    </div>


                                    <div className="border-t pt-4 w-full flex flex-col justify-end items-end">
                                        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
                                        <p className="text-gray-700">
                                            Subtotal: ₱{parseFloat(sales_order.total_amount).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            VAT: ₱{parseFloat(sales_order.total_amount * 0.12).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            VAT Amount: ₱{parseFloat(sales_order.total_amount * (1 - 0.12)).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            Shipping Cost: ₱{parseFloat(sales_order.shipping_cost).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            Rush Order Fee: ₱{parseFloat(sales_order.rush_order_fee).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700 font-bold">
                                            Grand Total: ₱{parseFloat(sales_order.grand_amount).toFixed(2)}
                                        </p>
                                        
                                    </div>

                                    <div className="border-t pt-4 w-full ">
                                        <h2 className="text-xl font-semibold mb-2">Remarks/Note:</h2>
                                        <Textarea 
                                            className="w-full border h-40 p-4 rounded-xl" 
                                            value={data.remarks} 
                                            onChange={(e) => setData('remarks', e.target.value)}
                                        >
                                        </Textarea>
                                        <InputError message={errors.remarks} />
                                    </div>
                                    <button className="p-2 bg-blue-600 text-white rounded-xl" onClick={handleUpdate}> Update </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SalesOrderView;
