import React, {useState, useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const MTOSalesPaymentsList = ({ mto_sales_payments }) => {
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const handleFilter = () => {
        router.visit('/made_to_orders', {
        method: 'get',
        data: { search, fromDate, toDate },
        preserveState: true,
        preserveScroll: true,
        });
    };

    useEffect(() => {
        console.log(mto_sales_payments);
    }, [])
    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    MTO Sales Payments
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
                                        href="/mto_sales_payments/create"
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
                                <div className="col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                <div>
                                    <label className="block text-sm font-medium">From Date:</label>
                                    <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="border rounded p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">To Date:</label>
                                    <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="border rounded p-2"
                                    />
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                >
                                    Filter
                                </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search for Order Number, Customer Name, Tracking #"
                                    className="w-full rounded-md border p-2 mb-2"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2">
                                                #
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                MTO #
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
                                        {mto_sales_payments.data?.map(
                                            (sales_payment, index) => (
                                                <tr key={sales_payment.id}>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {
                                                            sales_payment
                                                                .sales_order
                                                                .mto_order_number
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
                                                            href={`/mto_sales_payments/${sales_payment.id}/edit`}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <Link
                                                            href={`/mto_sales_payments/${sales_payment.id}`}
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
                                {mto_sales_payments.links && (
                                    <div className="mt-4 flex justify-center">
                                        {mto_sales_payments.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url) {
                                                        router.visit(link.url, {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                className={`mx-1 px-3 py-1 border rounded ${
                                                    link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            ></button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MTOSalesPaymentsList;
