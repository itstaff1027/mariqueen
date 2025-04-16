import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const ReturnsIndex = ({ sales_order_returns }) => {

    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const handleFilter = () => {
        router.visit('/point_of_sales', {
            method: 'get',
            data: { search, fromDate, toDate },
            preserveState: true,
            preserveScroll: true,
        });
    };
    
    useEffect(() => {
        console.log(sales_order_returns)
    }, [])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Sales Order Returns
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-4 flex justify-between">
                                <h1 className="text-lg font-semibold">
                                    Return List
                                </h1>
                                <Link
                                    href="/sales_order_returns/create"
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Create New Return Order
                                </Link>
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

                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">
                                            #
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            RO-#
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            SO-#
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Customer
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Status
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Return Date
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales_order_returns.data?.map(
                                        (sales_return, index) => (
                                            <tr key={sales_return.id}>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {sales_return.return_number}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        sales_return.reference_order.order_number
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {sales_return.reference_order.customers.first_name} {sales_return.reference_order.customers.last_name}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {sales_return.status}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {new Date(sales_return.return_date).toDateString()}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        sales_return.status == "pending" && <Link
                                                            href={`/sales_order_returns/${sales_return.id}/edit`}
                                                            className="mr-2 text-blue-500 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                    }
                                                    
                                                    <Link
                                                        href={`/sales_order_returns/${sales_return.id}`}
                                                        className="mr-2 text-yellow-500 hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                    {/* <Link
                                                        href={`/returns/${sales_return.id}`}
                                                        method="delete"
                                                        className="text-red-500 hover:underline"
                                                        as="button"
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent default link behavior
                                                            if (
                                                                confirm(
                                                                    'Are you sure you want to remove this Courier?',
                                                                )
                                                            ) {
                                                                // Perform the deletion
                                                                router.delete(
                                                                    `/returns/${sales_return.id}`,
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Link> */}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                            {sales_order_returns.links && (
                                <div className="mt-4 flex justify-center">
                                    {sales_order_returns.links.map((link, index) => (
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
        </AuthenticatedLayout>
    );
};

export default ReturnsIndex;
