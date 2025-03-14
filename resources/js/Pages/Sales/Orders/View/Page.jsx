import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Textarea } from '@headlessui/react';

const SalesOrderView = ({ sales_order, user}) => {
    // const { auth } = usePage().props;
    const [search, setSearch] = useState("");
    const [color, setColors] = useState("");
    const [size, setSizes] = useState("");
    const [sizeValue, setSizeValues] = useState("");
    const [heelHeight, setHeelHeights] = useState("");
    const [category, setCategory] = useState("");
    const [qtyFilter, setQtyFilter] = useState("all"); // New state for quantity filter
    const [statuses, setStatuses] = useState([]);

    // const filteredProducts = products.filter(stock => {
    //     // Compute overall quantity
    //     const overallQty = stock.total_stock;

    //     // Check quantity filter
    //     let qtyMatches = true;
    //     if (qtyFilter === "positive") {
    //         qtyMatches = overallQty > 0;
    //     } else if (qtyFilter === "zero") {
    //         qtyMatches = overallQty === 0;
    //     } else if (qtyFilter === "negative") {
    //         qtyMatches = overallQty < 0;
    //     }

    //     // Other filters
    //     const matchesFilters = (
    //         (!category || stock.product_variant.category_id === parseInt(category)) &&
    //         (!size || stock.product_variant.size_id === parseInt(size)) &&
    //         (!sizeValue || stock.product_variant.size_value_id === parseInt(sizeValue)) &&
    //         (!heelHeight || stock.product_variant.heel_height_id === parseInt(heelHeight)) &&
    //         (!color || stock.product_variant.color_id === parseInt(color))
    //     );

    //     const matchesSearch = search === "" ||
    //         stock.product_variant.sku.toLowerCase().includes(search.toLowerCase()) ||
    //         stock.product_variant.colors.color_name.toLowerCase().includes(search.toLowerCase()) ||
    //         stock.product_variant.categories.category_name.toLowerCase().includes(search.toLowerCase());

    //     return matchesFilters && matchesSearch && qtyMatches;
    // });

    useEffect(() => {
        setStatuses(allowedStatuses(user));
    }, [user]);

    // Existing export to Excel function remains unchanged (if needed)
    // const handleExportExcel = () => {
    //     const exportData = filteredProducts.map((product) => ({
    //         SKU: product.product_variant.sku,
    //         Design: product.product_variant.product.product_name,
    //         Color: product.product_variant.colors.color_name,
    //         Size: product.product_variant.sizes.size_name,
    //         SizeValues: product.product_variant.size_values.size_values,
    //         HeelHeight: product.product_variant.heel_heights.value,
    //         Category: product.product_variant.categories.category_name,
    //         OverallQty: product.total_stock,
    //     }));

    //     const worksheet = XLSX.utils.json_to_sheet(exportData);
    //     const workbook = XLSX.utils.book_new();

    //     XLSX.utils.book_append_sheet(workbook, worksheet, `${warehouse.name} Products`);
    //     XLSX.writeFile(workbook, `${warehouse.name}_product_list_${new Date().toISOString().split('T')[0]}.xlsx`);
    // };

    
    // const user = usePage().props.auth.user; // Ensure your auth system passes user permissions

    const allowedStatuses = (user) => {
        // const statuses = [];
        // Flatten the permissions from all roles into one array
        const allPermissions = user.roles.flatMap(role => role.permissions);
        const statuses = [];
        if (allPermissions.some(perm => perm.name === 'approve')) {
            statuses.push('approved');
        }
        if (allPermissions.some(perm => perm.name === 'update')) {
            statuses.push('paid');
        }
        if (allPermissions.some(perm => perm.name === 'update')) {
            statuses.push('partial');
        }
        if (allPermissions.some(perm => perm.name === 'refund')) {
            statuses.push('refunded');
        }
        return statuses;
    };
      
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

    const updateOrderStatus = (status) => {
        console.log(status)
        const newStatus = status;
        router.post(`/sales_orders/update/status/${sales_order.id}`, { new_status: newStatus})
    }
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {sales_order.order_number}
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-md">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div>
                                    <select
                                        value={sales_order?.status}
                                        // onChange={(e) => updateOrderStatus(e.target.value)}
                                        className="rounded-lg bg-green-500 px-5 py-2 text-white shadow transition hover:bg-green-600"
                                    >
                                        {statuses.map((status) => (
                                            <option
                                                key={status}
                                                value={status}
                                                onClick={(e) =>
                                                    updateOrderStatus(
                                                        e.target.value,
                                                    )
                                                }
                                                disabled={sales_order?.status === status}
                                            >
                                                {status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex w-full flex-col items-center justify-center p-10">
                                    <div className="grid w-full grid-cols-2 border-b-2">
                                        <h1 className="w-full text-left text-3xl font-bold">
                                            Order Date: {formatDate(sales_order.created_at)}
                                        </h1>
                                        <h1 className="w-full text-right text-3xl font-bold">
                                            Status: {sales_order.status}
                                        </h1>
                                    </div>

                                    <div className="w-full p-4">
                                        <h2 className="mb-2 text-xl font-semibold">
                                            Customer Information
                                        </h2>
                                        {sales_order.customers ? (
                                            <div>
                                                <p className="text-gray-700">
                                                    {
                                                        sales_order.customers
                                                            .first_name
                                                    }{' '}
                                                    {
                                                        sales_order.customers
                                                            .last_name
                                                    }
                                                </p>
                                                <p className="text-gray-700">
                                                    Email:{' '}
                                                    {
                                                        sales_order.customers
                                                            .email
                                                    }
                                                </p>
                                                <p className="text-gray-700">
                                                    Phone:{' '}
                                                    {
                                                        sales_order.customers
                                                            .phone
                                                    }
                                                </p>
                                                <p className="text-gray-700">
                                                    Address:{' '}
                                                    {
                                                        sales_order.customers
                                                            .address
                                                    }
                                                </p>
                                                {sales_order.customers
                                                    .receiver_name && (
                                                    <p className="text-gray-700">
                                                        Receiver:{' '}
                                                        {
                                                            sales_order
                                                                .customers
                                                                .receiver_name
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-700">
                                                No customer information
                                                available.
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-8 w-full">
                                        <h2 className="mb-2 text-xl font-semibold">
                                            Order Items
                                        </h2>
                                        <table className="min-w-full border border-gray-300">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border px-4 py-2 text-left">
                                                        SKU
                                                    </th>
                                                    {/* <th className="border px-4 py-2 text-left">Description</th> */}
                                                    <th className="border px-4 py-2 text-right">
                                                        Quantity
                                                    </th>
                                                    <th className="border px-4 py-2 text-right">
                                                        Unit Price
                                                    </th>
                                                    <th className="border px-4 py-2 text-right">
                                                        Total Price
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sales_order.items &&
                                                sales_order.items.length > 0 ? (
                                                    sales_order.items.map(
                                                        (item) => (
                                                            <tr key={item.id}>
                                                                <td className="border px-4 py-2">
                                                                    {
                                                                        item
                                                                            .product_variant
                                                                            .sku
                                                                    }
                                                                </td>
                                                                {/* <td className="border px-4 py-2">
                                                                {item.product_variant}
                                                            </td> */}
                                                                <td className="border px-4 py-2 text-right">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </td>
                                                                <td className="border px-4 py-2 text-right">
                                                                    ₱
                                                                    {parseFloat(
                                                                        item.unit_price,
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                                <td className="border px-4 py-2 text-right">
                                                                    ₱
                                                                    {parseFloat(
                                                                        item.total_price,
                                                                    ).toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            className="border px-4 py-2 text-center"
                                                            colSpan="5"
                                                        >
                                                            No items found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mb-8 w-full">
                                        <h2 className="mb-2 text-xl font-semibold">
                                            Payment Information
                                        </h2>
                                        <table className="min-w-full border border-gray-300">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="border px-4 py-2 text-left">
                                                        Payment Method
                                                    </th>
                                                    <th className="border px-4 py-2 text-left">
                                                        Amount Paid
                                                    </th>
                                                    <th className="border px-4 py-2 text-left">
                                                        Change Due
                                                    </th>
                                                    <th className="border px-4 py-2 text-right">
                                                        Excess
                                                    </th>
                                                    <th className="border px-4 py-2 text-right">
                                                        Balance
                                                    </th>
                                                    <th className="border px-4 py-2 text-right">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sales_order.payments &&
                                                sales_order.payments.length >
                                                    0 ? (
                                                    sales_order.payments.map(
                                                        (payment) => (
                                                            <tr
                                                                key={payment.id}
                                                            >
                                                                <td className="border px-4 py-2">
                                                                    {
                                                                        payment
                                                                            .payment_method
                                                                            .name
                                                                    }
                                                                </td>
                                                                <td className="border px-4 py-2">
                                                                    ₱
                                                                    {
                                                                        payment.amount_paid
                                                                    }
                                                                </td>
                                                                <td className="border px-4 py-2 text-right">
                                                                    ₱
                                                                    {
                                                                        payment.change_due
                                                                    }
                                                                </td>
                                                                <td className="border px-4 py-2 text-right">
                                                                    ₱
                                                                    {
                                                                        payment.excess_amount
                                                                    }
                                                                </td>
                                                                <td className="border px-4 py-2 text-right">
                                                                    ₱
                                                                    {
                                                                        payment.remaining_balance
                                                                    }
                                                                </td>
                                                                <td className="border px-4 py-2 text-right">
                                                                    {formatDate(
                                                                        payment.created_at,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            className="border px-4 py-2 text-center"
                                                            colSpan="5"
                                                        >
                                                            No items found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex w-full flex-col items-end justify-end border-t pt-4">
                                        <h2 className="mb-2 text-xl font-semibold">
                                            Order Summary
                                        </h2>
                                        <p className="text-gray-700">
                                            Subtotal: ₱
                                            {parseFloat(
                                                sales_order.total_amount,
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            VATables: ₱
                                            {parseFloat(
                                                sales_order.total_amount / 1.12,
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            VAT: ₱
                                            {parseFloat(
                                                (sales_order.total_amount /
                                                    1.12) *
                                                    0.12,
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            Shipping Cost: ₱
                                            {parseFloat(
                                                sales_order.shipping_cost,
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-gray-700">
                                            Rush Order Fee: ₱
                                            {parseFloat(
                                                sales_order.rush_order_fee,
                                            ).toFixed(2)}
                                        </p>
                                        <p className="font-bold text-gray-700">
                                            Grand Total: ₱
                                            {parseFloat(
                                                sales_order.grand_amount,
                                            ).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="w-full border-t pt-4">
                                        <h2 className="mb-2 text-xl font-semibold">
                                            Remarks/Note:
                                        </h2>
                                        <div
                                            className={`h-40 w-full rounded-xl border p-4`}
                                        >
                                            {sales_order.remarks}
                                        </div>
                                    </div>
                                </div>

                                <div className="py-12">
                                    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
                                        {/* Header Section */}
                                        <div className="mb-8 border-b pb-4">
                                            <h1 className="mb-2 text-3xl font-bold">
                                                Sales Order
                                            </h1>
                                            <p className="text-gray-600">
                                                Order Number:{' '}
                                                {sales_order.order_number}
                                            </p>
                                            <p className="text-gray-600">
                                                Order Date:{' '}
                                                {formatDate(
                                                    sales_order.created_at,
                                                )}
                                            </p>
                                            <p className="text-gray-600">
                                                Status: {sales_order.status}
                                            </p>
                                        </div>

                                        {/* Customer Information */}
                                        <div className="mb-8 border-b pb-4">
                                            <h2 className="mb-2 text-xl font-semibold">
                                                Customer Information
                                            </h2>
                                            {sales_order.customers ? (
                                                <div>
                                                    <p className="text-gray-700">
                                                        {
                                                            sales_order
                                                                .customers
                                                                .first_name
                                                        }{' '}
                                                        {
                                                            sales_order
                                                                .customers
                                                                .last_name
                                                        }
                                                    </p>
                                                    <p className="text-gray-700">
                                                        Email:{' '}
                                                        {
                                                            sales_order
                                                                .customers.email
                                                        }
                                                    </p>
                                                    <p className="text-gray-700">
                                                        Phone:{' '}
                                                        {
                                                            sales_order
                                                                .customers.phone
                                                        }
                                                    </p>
                                                    <p className="text-gray-700">
                                                        Address:{' '}
                                                        {
                                                            sales_order
                                                                .customers
                                                                .address
                                                        }
                                                    </p>
                                                    {sales_order.customers
                                                        .receiver_name && (
                                                        <p className="text-gray-700">
                                                            Receiver:{' '}
                                                            {
                                                                sales_order
                                                                    .customers
                                                                    .receiver_name
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-700">
                                                    No customer information
                                                    available.
                                                </p>
                                            )}
                                        </div>

                                        {/* Order Items */}
                                        <div className="mb-8">
                                            <h2 className="mb-2 text-xl font-semibold">
                                                Order Items
                                            </h2>
                                            <table className="min-w-full border border-gray-300">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="border px-4 py-2 text-left">
                                                            SKU
                                                        </th>
                                                        {/* <th className="border px-4 py-2 text-left">Description</th> */}
                                                        <th className="border px-4 py-2 text-right">
                                                            Quantity
                                                        </th>
                                                        <th className="border px-4 py-2 text-right">
                                                            Unit Price
                                                        </th>
                                                        <th className="border px-4 py-2 text-right">
                                                            Total Price
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sales_order.items &&
                                                    sales_order.items.length >
                                                        0 ? (
                                                        sales_order.items.map(
                                                            (item) => (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >
                                                                    <td className="border px-4 py-2">
                                                                        {
                                                                            item
                                                                                .product_variant
                                                                                .sku
                                                                        }
                                                                    </td>
                                                                    {/* <td className="border px-4 py-2">
                                                                {item.product_variant}
                                                            </td> */}
                                                                    <td className="border px-4 py-2 text-right">
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </td>
                                                                    <td className="border px-4 py-2 text-right">
                                                                        ₱
                                                                        {parseFloat(
                                                                            item.unit_price,
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </td>
                                                                    <td className="border px-4 py-2 text-right">
                                                                        ₱
                                                                        {parseFloat(
                                                                            item.total_price,
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                className="border px-4 py-2 text-center"
                                                                colSpan="5"
                                                            >
                                                                No items found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Payment Information */}
                                        <div className="mb-8 border-t pt-4">
                                            <h2 className="mb-2 text-xl font-semibold">
                                                Payment Information
                                            </h2>
                                            {sales_order.payments &&
                                            sales_order.payments.length > 0 ? (
                                                sales_order.payments.map(
                                                    (payment) => (
                                                        <div
                                                            key={payment.id}
                                                            className="mb-2"
                                                        >
                                                            <p className="text-gray-700">
                                                                Amount Paid: ₱
                                                                {parseFloat(
                                                                    payment.amount_paid,
                                                                ).toFixed(2)}
                                                            </p>
                                                            <p className="text-gray-700">
                                                                Change Due: ₱
                                                                {parseFloat(
                                                                    payment.change_due,
                                                                ).toFixed(2)}
                                                            </p>
                                                            <p className="text-gray-700">
                                                                Remaining
                                                                Balance: ₱
                                                                {parseFloat(
                                                                    payment.remaining_balance,
                                                                ).toFixed(2)}
                                                            </p>
                                                            <p className="text-gray-700">
                                                                Payment Method:{' '}
                                                                {
                                                                    payment
                                                                        .payment_method
                                                                        .name
                                                                }
                                                            </p>
                                                            <p className="text-gray-700">
                                                                Status:{' '}
                                                                {payment.status}
                                                            </p>
                                                        </div>
                                                    ),
                                                )
                                            ) : (
                                                <p className="text-gray-700">
                                                    No payment information
                                                    available.
                                                </p>
                                            )}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="border-t pt-4">
                                            <h2 className="mb-2 text-xl font-semibold">
                                                Order Summary
                                            </h2>
                                            <p className="text-gray-700">
                                                Subtotal: ₱
                                                {parseFloat(
                                                    sales_order.total_amount,
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-gray-700">
                                                VATables: ₱
                                                {parseFloat(
                                                    sales_order.total_amount /
                                                        1.12,
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-gray-700">
                                                VAT: ₱
                                                {parseFloat(
                                                    (sales_order.total_amount /
                                                        1.12) *
                                                        0.12,
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-gray-700">
                                                Shipping Cost: ₱
                                                {parseFloat(
                                                    sales_order.shipping_cost,
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-gray-700">
                                                Rush Order Fee: ₱
                                                {parseFloat(
                                                    sales_order.rush_order_fee,
                                                ).toFixed(2)}
                                            </p>
                                            <p className="font-bold text-gray-700">
                                                Grand Total: ₱
                                                {parseFloat(
                                                    sales_order.grand_amount,
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SalesOrderView;
