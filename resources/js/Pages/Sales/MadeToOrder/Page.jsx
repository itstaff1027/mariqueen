import React, {useState, useEffect} from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OnlineReceipt from '@/Components/Print/OnlineReceipt';
import MTOSquare from '@/Components/Print/MTOSquare';

const SalesMTOList = ({ made_to_orders }) => {
    const [printModalData, setPrintModalData] = useState(null);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const { auth } = usePage().props;
    const userRoles = auth.user.roles[0];

    const handleFilter = () => {
        router.visit('/made_to_orders', {
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
        // console.log(made_to_orders);
        // console.log(auth);
    }, [])

    const exportExcel = () => {
        // Define a header row with order fields + payment fields + item fields
        const headerRow = [
          "Order Number", "Client Name", "Agent Name", "Sold From", "Tracking Number", "Courier",
          "Shoulder By", "Packaging Type", "Shipping Cost", "Rush Cost", "Total Cost", "Client Payment",
          "Status", "Created At", "Updated At",
          "Payment ID", "Payment Amount", "Excess Amount", "Remaining Balance", "Payment Status", "Payment Method", "Payment Created At",
          "Item ID", "Quantity", "Unit Price", "Total Price", "Discount Amount", "Product Name", "Color", "Size", "Heel Height", "Round", "Length", "Back Strap", "Type of Heel"
        ];
      
        // This array will hold all rows.
        let worksheetData = [headerRow];
        const orderLevelColumns = 15; 
        let mergeRanges = [];
        let currentRow = 1;
      
        // Loop through each sales order
        made_to_orders.data.forEach(order => {
          // Build your order row (order-level data)
          const orderRow = [
            order.mto_order_number,
            order.customers.first_name + ' ' + order.customers.last_name,
            order.user.name,
            userRoles.name,
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
                item.made_to_order_product?.product_name || "",
                item.made_to_order_product?.color || "",
                item.made_to_order_product?.size || "",
                item.made_to_order_product?.heel_height || "",
                item.made_to_order_product?.round || "",
                item.made_to_order_product?.length || "",
                item.made_to_order_product?.back_strap || "",
                item.made_to_order_product?.type_of_heel || ""
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
        XLSX.writeFile(workbook, `made_to_orders_${new Date().toISOString().split("T")[0]}.xlsx`);
      };
      
    
    return(
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Made to Order
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="bg-white p-6 rounded-2xl shadow-md space-y-6 w-full mb-2">
                                    <div className="flex flex-col w-full justify-between md:flex-row md:justify-betweem md:items-center gap-4">
                                        <h1 className="text-3xl font-semibold">MTO</h1>
                                        <div className="flex flex-wrap gap-3 justify-end w-full">
                                            <Link
                                                href="/made_to_orders/create"
                                                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                            >
                                                Create Order
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
                                            placeholder="Search for Order Number, Customer Name, Tracking #"
                                            className="w-full absolute -translate-y-1/2 text-gray-400"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
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
                                            <th className="border border-gray-300 px-4 py-2">Balance</th>
                                            <th className="border border-gray-300 px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {made_to_orders.data?.map((made_to_order, index) => (
                                        <tr key={made_to_order.id}>
                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2">{made_to_order.mto_order_number}</td>
                                            <td className="border border-gray-300 px-4 py-2">{made_to_order.customers.first_name} {made_to_order.customers.last_name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{made_to_order.tracking_number ? made_to_order.tracking_number : 'No Tracking # added yet.'}</td>
                                            <td className="border border-gray-300 px-4 py-2">{made_to_order.status}</td>
                                            <td className="border border-gray-300 px-4 py-2">{made_to_order.grand_amount}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {made_to_order.payments.reduce((total, p) => total + parseFloat(p.amount_paid, 2), 0).toFixed(2)}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{made_to_order.balance}</td>
                                            <td className="border border-gray-300 px-6 py-3 space-x-2">
                                                <button
                                                    onClick={() => openPrintModal(made_to_order)}
                                                    className="p-2 rounded-xl text-red-500 hover:underline"
                                                >
                                                    Print
                                                </button>
                                                <Link
                                                    href={`/made_to_orders/${made_to_order.id}/edit`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/made_to_orders/${made_to_order.id}`}
                                                    className="text-emerald-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {made_to_orders.links && (
                                    <div className="mt-4 flex justify-center">
                                        {made_to_orders.links.map((link, index) => (
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
                <MTOSquare order={printModalData} onClose={closePrintModal} />
            )}
        </AuthenticatedLayout>
    )
};

export default SalesMTOList;
