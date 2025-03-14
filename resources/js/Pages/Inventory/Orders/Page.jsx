import React, {useState, useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const SalesOrderList = ({ sales_orders }) => {

    const destroy = (e, id) => {
        e.preventDefault();

        // if (confirm('Are you sure?')){
        //     router.delete(`/sales_orders/${id}`);
        // }
    };

    useEffect(() => {
        console.log(sales_orders);
    }, [])
    
    return(
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Sales Orders
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Sales Order</h1>
                                    {/* <Link
                                        href="/point_of_sales/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Create Order
                                    </Link> */}
                                    {/* <Link
                                        href="/sales_order/assign_sales_order"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Assign User to sales_order
                                    </Link> */}
                                </div>
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2">#</th>
                                            <th className="border border-gray-300 px-4 py-2">Order #</th>
                                            <th className="border border-gray-300 px-4 py-2">Client Name</th>
                                            <th className="border border-gray-300 px-4 py-2">Tracking #</th>
                                            <th className="border border-gray-300 px-4 py-2">Status</th>
                                            <th className="border border-gray-300 px-4 py-2">Total Cost</th>
                                            <th className="border border-gray-300 px-4 py-2">Payment</th>
                                            <th className="border border-gray-300 px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales_orders?.map((sales_order, index) => (
                                        <tr key={sales_order.id}>
                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2">{sales_order.order_number}</td>
                                            <td className="border border-gray-300 px-4 py-2">{sales_order.customers.first_name} {sales_order.customers.last_name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{sales_order.tracking_number ? sales_order.tracking_number : 'No Tracking # added yet.'}</td>
                                            <td className="border border-gray-300 px-4 py-2">{sales_order.status}</td>
                                            <td className="border border-gray-300 px-4 py-2">{sales_order.grand_amount}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {sales_order.payments.reduce((total, p) => total + parseFloat(p.amount_paid, 2), 0).toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 px-6 py-3 space-x-2">
                                                {/* <Link
                                                    href={`/point_of_sales/${sales_order.id}/edit`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link> */}
                                                <Link
                                                    href={`/inventory_orders/${sales_order.id}`}
                                                    className="text-emerald-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
};

export default SalesOrderList;
