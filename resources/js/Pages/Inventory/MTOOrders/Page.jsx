import React, {useState, useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import OnlineReceipt from '@/Components/Print/OnlineReceipt';
import MTOSquare from '@/Components/Print/MTOSquare';

const InventorySalesMTOList = ({ made_to_orders }) => {
    const [printModalData, setPrintModalData] = useState(null);
    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const handleFilter = () => {
        router.visit('/inventory_mto_orders', {
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
        console.log(made_to_orders);
    }, [])
    
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
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">MTO</h1>
                                    {/* <Link
                                        href="/made_to_orders/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Create Order
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
                                                {/* <Link
                                                    href={`/inventory_mto_orders/${made_to_order.id}/edit`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link> */}
                                                <Link
                                                    href={`/inventory_mto_orders/${made_to_order.id}`}
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

export default InventorySalesMTOList;
