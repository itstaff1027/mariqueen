import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StockTransactionList = ({ stock_transactions, warehouses }) => {
    
    useEffect(() => {
        console.log(stock_transactions);
        console.log(warehouses);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Stock Transactions
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Stock Transactions</h1>
                                    <div className="space-x-2">
                                        <Link
                                            href="/inventory/stock/transactions/create"
                                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                        >
                                            Create
                                        </Link>
                                        {/* <Link
                                            href="/inventory/stocks/transaction/transfer"
                                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                        >
                                            Transfer
                                        </Link> */}
                                    </div>
                                </div>
                                <table className="w-full table-auto border-collapse border text-center border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2">Transaction ID</th>
                                            <th className="border border-gray-300 px-4 py-2">From Warehouse</th>
                                            <th className="border border-gray-300 px-4 py-2">To Warehouse</th>
                                            <th className="border border-gray-300 px-4 py-2">Transaction Type</th>
                                            <th className="border border-gray-300 px-4 py-2">Status</th>
                                            <th className="border border-gray-300 px-4 py-2">Date</th>
                                            <th className="border border-gray-300 px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stock_transactions.map((transaction) => {
                                            // ✅ Get warehouse names safely
                                            const fromWarehouse = warehouses.find(w => w.id === transaction.from_warehouse_id)?.name || "N/A";
                                            const toWarehouse = warehouses.find(w => w.id === transaction.to_warehouse_id)?.name || "N/A";

                                            return (
                                                <tr key={transaction.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{transaction.id}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{fromWarehouse}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{toWarehouse}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{transaction.transaction_type}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{transaction.status}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{new Date(transaction.created_at).toLocaleString()}</td>
                                                    <td className="border border-gray-300 px-6 py-3 space-x-2">
                                                        <Link
                                                            href={`/inventory/stock/transactions/${transaction.id}`}
                                                            className="text-orange-500 hover:underline"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
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

export default StockTransactionList;
