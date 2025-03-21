import React, {useState, useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const SalesPaymentsList = ({ sales_payments }) => {

    const destroy = (e, id) => {
        e.preventDefault();

        // if (confirm('Are you sure?')){
        //     router.delete(`/sales_payments/${id}`);
        // }
    };

    useEffect(() => {
        console.log(sales_payments);
    }, [])
    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Sales Payments
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-md">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h1 className="text-2xl font-bold">
                                        Sales Payment
                                    </h1>
                                    <Link
                                        href="/sales_payments/create"
                                        className="rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
                                    >
                                        Create Payment
                                    </Link>
                                    {/* <Link
                                        href="/sales_payment/assign_sales_payment"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Assign User to sales_payment
                                    </Link> */}
                                </div>
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2">
                                                #
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Order #
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Client Name
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Status
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Total Cost
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Balance
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Payment
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales_payments?.map(
                                            (sales_payment, index) => (
                                                <tr key={sales_payment.id}>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {
                                                            sales_payment
                                                                .sales_order
                                                                .order_number
                                                        }
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {
                                                            sales_payment
                                                                .sales_order.customers
                                                                .first_name
                                                        }{' '}
                                                        {
                                                            sales_payment
                                                                .sales_order.customers
                                                                .last_name
                                                        }
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {sales_payment.status}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {sales_payment.sales_order.grand_amount}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {
                                                            sales_payment.remaining_balance
                                                        }
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {sales_payment.amount_paid}
                                                    </td>
                                                    <td className="space-x-2 border border-gray-300 px-6 py-3">
                                                        <Link
                                                            href={`/sales_payments/${sales_payment.id}/edit`}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <Link
                                                            href={`/sales_payments/${sales_payment.id}`}
                                                            className="text-emerald-500 hover:underline"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SalesPaymentsList;
