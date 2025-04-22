import React, {useState, useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const SalesPaymentsList = ({ sales_payments }) => {
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const handleFilter = () => {
        router.visit('/sales_payments', {
        method: 'get',
        data: { search, fromDate, toDate },
        preserveState: true,
        preserveScroll: true,
        });
    };

    useEffect(() => {
        console.log(sales_payments);
    }, [])

    const exportExcel = () => {
        // Build header row for the simple report.
        const headerRow = [
            "Order #",
            "Client Name",
            "Status",
            "Payment Method",
            "Total Cost",
            "Balance",
            "Payment",
            "Excess",
            "Created At"
        ];
    
        // Export only the currently loaded (filtered & paginated) data
        // Now mapping each transaction into an array instead of an object.
        const dataRows = sales_payments.data.map((transaction) => [
            transaction.sales_order.order_number,
            transaction.sales_order.customers.first_name +
                ' ' +
                transaction.sales_order.customers.last_name,
            transaction.status,
            transaction.payment_method.name,
            transaction.sales_order.grand_amount,
            transaction.remaining_balance,
            transaction.amount_paid,
            transaction.excess,
            transaction.created_at
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Payment Transactions");
        XLSX.writeFile(
            workbook,
            `Sales_Payment_Transactions_${new Date().toISOString().split("T")[0]}.xlsx`
        );
    };
    
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
                                <div className="bg-white p-6 rounded-2xl shadow-md space-y-6 w-full mb-2">
                                    <div className="flex flex-col w-full justify-between md:flex-row md:justify-betweem md:items-center gap-4">
                                        <h1 className="text-3xl w-full font-semibold">Sales Payments</h1>
                                        <div className="flex flex-wrap gap-3 justify-end w-full">
                                            <Link
                                                href="/sales_payments/create"
                                                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                            >
                                                Create Payments
                                            </Link>
                                            <button 
                                                onClick={exportExcel}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                                            >
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">From Date:</label>
                                            <input
                                                type="date"
                                                value={fromDate}
                                                onChange={(e) => setFromDate(e.target.value)}
                                                className="border w-full rounded p-2"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700">To Date:</label>
                                            <input
                                                type="date"
                                                value={toDate}
                                                onChange={(e) => setToDate(e.target.value)}
                                                className="border w-full rounded p-2"
                                            />
                                        </div>
                                        <button
                                            onClick={handleFilter}
                                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                        >
                                            Filter
                                        </button>
                                        
                                    </div>
                                    <div className="w-full relative m-0">
                                        <input
                                            type="text"
                                            placeholder="Search for Order Number, Customer Name, or Status"
                                            className="w-full absolute -translate-y-1/2 text-gray-400"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
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
                                        {sales_payments.data?.map(
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
                                {sales_payments.links && (
                                                                                  <div className="mt-4 flex justify-center">
                                                                                    {sales_payments.links.map((link, index) => (
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

export default SalesPaymentsList;
