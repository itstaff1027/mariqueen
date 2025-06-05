import React, { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InventoryLayout from '@/Layouts/InventoryLayout';
import { LinkIconCreate } from '@/Components/UI/Links';

const StockTransactionList = ({ stock_transactions, warehouses }) => {
    const [search, setSearch] = useState("");
    const [fromWarehouse, setFromWarehouse] = useState("");
    const [toWarehouse, setToWarehouse] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [status, setStatus] = useState("");
    const [fromDate, setFromDate] = useState("");  // New state for start date
    const [toDate, setToDate] = useState("");      // New state for end date

    const handleFilter = () => {
        // Trigger a new request with the filter parameters, including the date range
        router.visit('/inventory/stock/transactions', {
            method: 'get',
            data: {
                fromWarehouse,
                toWarehouse,
                transactionType,
                status,
                search,
                fromDate,  // Pass start date
                toDate     // Pass end date
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportExcel = () => {
        // Build header row for the simple report.
        const headerRow = [
            "Transaction ID",
            "From Warehouse",
            "To Warehouse",
            "Transaction Type",
            "Status",
            "Created At",
            "Updated At"
        ];
    
        // Export only the currently loaded (filtered & paginated) data
        // Now mapping each transaction into an array instead of an object.
        const dataRows = stock_transactions.data.map(transaction => [
            transaction.id,
            warehouses.find(wh => wh.id === transaction.from_warehouse_id)?.name || 'N/A',
            warehouses.find(wh => wh.id === transaction.to_warehouse_id)?.name || 'N/A',
            transaction.transaction_type,
            transaction.status,
            transaction.created_at,
            transaction.updated_at
        ]);
    
        // Combine header row and data rows.
        const worksheetData = [headerRow, ...dataRows];
    
        // Create worksheet and workbook.
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
        // Auto-fit columns.
        const colWidths = headerRow.map((header, colIndex) => {
            let maxLength = header ? header.toString().length : 10;
            worksheetData.forEach((row) => {
                const cell = row[colIndex];
                if (cell) {
                    maxLength = Math.max(maxLength, cell.toString().length);
                }
            });
            return { wch: maxLength + 2 };
        });
        worksheet["!cols"] = colWidths;
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Transactions");
        XLSX.writeFile(
            workbook,
            `Stock_Transactions_${new Date().toISOString().split("T")[0]}.xlsx`
        );
    };
    

    useEffect(() => {
        console.log(stock_transactions);
        console.log(warehouses);
    }, []);

    return (
        <InventoryLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Stock Transactions
                    </h2>
                    <LinkIconCreate
                        href="/inventory/stock/transactions/create"
                        name={"Create Stock Transactions"}
                    />
                </div>
            }
        >
            <div className="p-6">
                <div className="container mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Stock Transactions</h1>
                        <div className="space-x-2">
                            <button 
                                onClick={exportExcel}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Export to Excel
                            </button>
                        </div>
                    </div>

                    <div className="col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <input
                            type="text"
                            placeholder="Search for a TS#..."
                            className="w-full rounded-md border p-2 mb-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            value={fromWarehouse || ''}
                            className="rounded-md border p-2 shadow-sm focus:outline-none"
                            onChange={(e) => setFromWarehouse(e.target.value)}
                        >
                            <option value="">From Warehouse</option>
                            {warehouses.map((fwh) => (
                                <option key={fwh.id} value={fwh.id}>
                                    {fwh.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={toWarehouse || ''}
                            className="rounded-md border p-2 shadow-sm focus:outline-none"
                            onChange={(e) => setToWarehouse(e.target.value)}
                        >
                            <option value="">To Warehouse</option>
                            {warehouses.map((twh) => (
                                <option key={twh.id} value={twh.id}>
                                    {twh.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={transactionType || ''}
                            className="rounded-md border p-2 shadow-sm focus:outline-none"
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <option value="">Transaction Types</option>
                            <option value="purchase">Purchase</option>
                            <option value="transfer">Transfer</option>
                        </select>

                        <select
                            value={status || ''}
                            className="rounded-md border p-2 shadow-sm focus:outline-none"
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Status</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {/* Date Filteration Fields */}
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
                            {stock_transactions.data.map((transaction) => {
                                // Safely get warehouse names
                                const fromWarehouseName = warehouses.find(w => w.id === transaction.from_warehouse_id)?.name || "N/A";
                                const toWarehouseName = warehouses.find(w => w.id === transaction.to_warehouse_id)?.name || "N/A";

                                return (
                                    <tr key={transaction.id}>
                                        <td className="border border-gray-300 px-4 py-2">{transaction.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{fromWarehouseName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{toWarehouseName}</td>
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
                    {/* Pagination */}
                    {stock_transactions.links && (
                        <div className="mt-4 flex justify-center">
                            {stock_transactions.links.map((link, index) => (
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
        </InventoryLayout>
    );
};

export default StockTransactionList;
