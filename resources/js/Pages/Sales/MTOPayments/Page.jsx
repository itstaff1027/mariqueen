import React, {useState, useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const MTOSalesPaymentsList = ({ mto_sales_payments }) => {
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const handleFilter = () => {
        router.visit('/mto_sales_payments', {
        method: 'get',
        data: { search, fromDate, toDate },
        preserveState: true,
        preserveScroll: true,
        });
    };

    useEffect(() => {
        console.log(mto_sales_payments);
    }, [])


    const exportExcel = () => {
        // Build header row for the simple report.
        const headerRow = [
            "Return #",
            "Sales #",
            "Client Name",
            "Status",
            "Type",
            "Return to",
            "Return Date",
            "Created At"
        ];
    
        // Export only the currently loaded (filtered & paginated) data
        // Now mapping each transaction into an array instead of an object.
        const dataRows = sales_order_returns.data.map((transaction) => [
            transaction.return_number,
            transaction.reference_order.order_number,
            transaction.reference_order.customers.first_name +
                ' ' +
                transaction.reference_order.customers.last_name,
            transaction.status,
            transaction.return_type,
            transaction.warehouse.name,
            transaction.return_date,
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "MTO Sales Payments Transactions");
        XLSX.writeFile(
            workbook,
            `MTO_Sales_Payments_Transactions_${new Date().toISOString().split("T")[0]}.xlsx`
        );
    };

    
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
                                <div className="mb-2 w-full space-y-6 rounded-2xl bg-white p-6 shadow-md">
                                    <div className="md:justify-betweem flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
                                        <h1 className="w-full text-3xl font-semibold">
                                            MTO Sales Payments
                                        </h1>
                                        <div className="flex w-full flex-wrap justify-end gap-3">
                                            <Link
                                                href="/sales_payments/create"
                                                className="rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
                                            >
                                                Create Payments
                                            </Link>
                                            <button
                                                onClick={exportExcel}
                                                className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                                            >
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                From Date:
                                            </label>
                                            <input
                                                type="date"
                                                value={fromDate}
                                                onChange={(e) =>
                                                    setFromDate(e.target.value)
                                                }
                                                className="w-full rounded border p-2"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700">
                                                To Date:
                                            </label>
                                            <input
                                                type="date"
                                                value={toDate}
                                                onChange={(e) =>
                                                    setToDate(e.target.value)
                                                }
                                                className="w-full rounded border p-2"
                                            />
                                        </div>
                                        <button
                                            onClick={handleFilter}
                                            className="rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
                                        >
                                            Filter
                                        </button>
                                    </div>
                                    <div className="relative m-0 w-full">
                                        <input
                                            type="text"
                                            placeholder="Search for MTO Order #, Client Name, or Payment status"
                                            className="absolute w-full -translate-y-1/2 text-gray-400"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
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
                                                                .sales_order
                                                                .customers
                                                                .first_name
                                                        }{' '}
                                                        {
                                                            sales_payment
                                                                .sales_order
                                                                .customers
                                                                .last_name
                                                        }
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {sales_payment.status}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {
                                                            sales_payment
                                                                .sales_order
                                                                .grand_amount
                                                        }
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {
                                                            sales_payment.remaining_balance
                                                        }
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        {
                                                            sales_payment.amount_paid
                                                        }
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
                                        {mto_sales_payments.links.map(
                                            (link, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        if (link.url) {
                                                            router.visit(
                                                                link.url,
                                                                {
                                                                    preserveState: true,
                                                                    preserveScroll: true,
                                                                },
                                                            );
                                                        }
                                                    }}
                                                    className={`mx-1 rounded border px-3 py-1 ${
                                                        link.active
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white text-blue-500'
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                ></button>
                                            ),
                                        )}
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
