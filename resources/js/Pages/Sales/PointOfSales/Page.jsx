import React, {useState, useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OnlineReceipt from '@/Components/Print/OnlineReceipt';

const SalesOrderList = ({ sales_orders }) => {
    const [printModalData, setPrintModalData] = useState(null);
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

    const openPrintModal = (order) => {
        setPrintModalData(order);
    };
    
    const closePrintModal = () => {
        setPrintModalData(null);
    };

    useEffect(() => {
        console.log(sales_orders);
    }, [])

    const exportExcel = () => {
        // Define a header row with order fields + payment fields + item fields
        const headerRow = [
          "Order Number", "Client Name", "Agent Name", "Sold From", "Tracking Number", "Courier",
          "Shoulder By", "Packaging Type", "Shipping Cost", "Rush Cost", "Total Cost", "Client Payment",
          "Status", "Created At", "Updated At",
          "Payment ID", "Payment Amount", "Excess Amount", "Remaining Balance", "Payment Status", "Payment Method", "Payment Created At",
          "Item ID", "Quantity", "Unit Price", "Total Price", "Discount Amount", "Product SKU", "Product Name", "Color", "Size", "Heel Height"
        ];
      
        // This array will hold all rows.
        let worksheetData = [headerRow];
        const orderLevelColumns = 15; 
        let mergeRanges = [];
        let currentRow = 1;
      
        // Loop through each sales order
        sales_orders.data.forEach(order => {
          // Build your order row (order-level data)
          const orderRow = [
            order.order_number,
            order.customers.first_name + ' ' + order.customers.last_name,
            order.user.name,
            order.warehouse.name,
            order.tracking_number,
            order.courier?.name || "",
            order.shoulder_by,
            order.packaging_type?.packaging_name || "",
            order.shipping_cost,
            order.rush_order_fee,
            order.total_amount,
            order.grand_amount, // or client payment if different
            order.status,
            order.created_at,
            order.updated_at
          ];
      
          // Determine number of rows needed for this order
          // At least 1 row even if both arrays are empty
          const numPayments = order.payments ? order.payments.length : 0;
          const numItems = order.items ? order.items.length : 0;
          const maxRows = Math.max(1, numPayments, numItems);
      
          // For each row required, add payment and item info if available.
          for (let i = 0; i < maxRows; i++) {
            const row = [...orderRow]; // copy order-level details
      
            // Payment data
            if (order.payments && order.payments[i]) {
              let payment = order.payments[i];
              row.push(
                payment.id,
                payment.amount_paid,
                payment.excess_amount,
                payment.remaining_balance,
                payment.status,
                payment.payment_method?.name || "",
                payment.created_at
              );
            } else {
              // push empty values if no payment at this index
              row.push("", "", "", "", "", "", "");
            }
      
            // Item data
            if (order.items && order.items[i]) {
              let item = order.items[i];
              row.push(
                item.id,
                item.quantity,
                item.unit_price,
                item.total_price,
                item.discount_amount,
                item.product_variant?.sku || "",
                item.product_variant?.product?.product_name || "",
                item.product_variant?.colors?.color_name || "",
                item.product_variant?.size_values?.size_values || "",
                item.product_variant?.heel_heights?.value || "",
              );
            } else {
              // push empty values if no item at this index
              row.push("", "", "", "", "", "", "", "", "", "");
            }

            if (maxRows > 1) {
                for (let col = 0; col < orderLevelColumns; col++) {
                  mergeRanges.push({
                    s: { r: currentRow, c: col },
                    e: { r: currentRow + maxRows - 1, c: col }
                  });
                }
              }
              currentRow += maxRows;
      
            worksheetData.push(row);
          }
            // If order spans more than one row, generate merge ranges for order-level columns.

        });
        
        // Create worksheet and auto-fit columns as in your original code
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
        // Auto-fit columns
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
        worksheet["!merges"] = mergeRanges;
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Transactions");
      
        // Generate filename based on the current date.
        XLSX.writeFile(workbook, `Sales_Orders_${new Date().toISOString().split("T")[0]}.xlsx`);
      };
      
    
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
                                    <Link
                                        href="/point_of_sales/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Create Order
                                    </Link>
                                    <button onClick={exportExcel}>Export</button>
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
                                            <th className="border border-gray-300 px-4 py-2">#</th>
                                            <th className="border border-gray-300 px-4 py-2">Order #</th>
                                            <th className="border border-gray-300 px-4 py-2">Client Name</th>
                                            <th className="border border-gray-300 px-4 py-2">Tracking #</th>
                                            <th className="border border-gray-300 px-4 py-2">Status</th>
                                            <th className="border border-gray-300 px-4 py-2">Total Cost</th>
                                            <th className="border border-gray-300 px-4 py-2">Payment</th>
                                            <th className="border border-gray-300 px-4 py-2">Balance</th>
                                            <th className="border border-gray-300 px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales_orders.data?.map((sales_order, index) => (
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
                                            <td className="border border-gray-300 px-4 py-2">{sales_order.balance}</td>
                                            <td className="border border-gray-300 px-6 py-3 space-x-2">
                                                <button
                                                    onClick={() => openPrintModal(sales_order)}
                                                    className="p-2 rounded-xl text-red-500 hover:underline"
                                                >
                                                    Print
                                                </button>
                                                <Link
                                                    href={`/point_of_sales/${sales_order.id}/edit`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/point_of_sales/${sales_order.id}`}
                                                    className="text-emerald-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {sales_orders.links && (
                                    <div className="mt-4 flex justify-center">
                                        {sales_orders.links.map((link, index) => (
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
            {printModalData && (
                <OnlineReceipt order={printModalData} onClose={closePrintModal} />
            )}
        </AuthenticatedLayout>
    )
};

export default SalesOrderList;
