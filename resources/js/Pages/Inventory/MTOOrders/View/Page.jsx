import React, { useEffect, useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Textarea } from '@headlessui/react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import ActionsDropdown from '@/Components/ActionsDropdown';
import MTOSquare from '@/Components/Print/MTOSquare';

const InventoryMTOOrderEdit = ({ made_to_order }) => {
    const { data, setData, put, errors } = useForm({

    });

    const { auth } = usePage().props;

    const [statuses, setStatuses] = useState([]);

    // const handleUpdate = (e) => {
    //     e.preventDefault();
    //     put(`/made_to_orders/${made_to_order.id}`);
    // };


    // useEffect(() => {
    //     console.log(made_to_order);
    // }, [made_to_order]);

    useEffect(() => {
        setStatuses(allowedStatuses(auth.user));
    }, [auth.user]);


    const allowedStatuses = (user) => {
        // const statuses = [];
        // Flatten the permissions from all roles into one array
        const allPermissions = user.roles.flatMap(role => role.permissions);
        const statuses = [];
        if (allPermissions.some(perm => perm.name === 'update' && made_to_order.status !== 'cancelled')) {
            statuses.push('preparing');
        }
        if (
            allPermissions.some(
                (perm) =>
                    perm.name === 'cancel' &&
                    made_to_order.status !== 'cancelled',
            )
        ) {
            statuses.push('cancel');
        }
        return statuses;
    };

    const updateStatus = (status) => {
        if (
            confirm(
                `Are you sure you want to update the order status to ${status}?`,
            )
        ) {
            const newStatus = status;
            router.post(`/inventory_mto_orders/update/status/${made_to_order.id}`, { new_status: newStatus})
            // console.log(newStatus);
        }
    }

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <AuthenticatedLayout
        header={
            <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                {made_to_order.mto_order_number}
            </h2>
        }
    >
        <div className="py-10">
        
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="p-8 space-y-6">
                        {/* Order Info */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="text-lg font-bold">
                                Order Date: <span className="underline">{formatDate(made_to_order.created_at)}</span>
                            </div>
                            <div className="text-lg font-bold mt-2 sm:mt-0">
                                Status: <span className="underline">{made_to_order.status.toUpperCase()}</span>
                                <ActionsDropdown states={statuses} onSelectStatus={(state) => updateStatus(state)} />
                            </div>
                        </div>

                        {/* Courier and Packaging */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="text-md font-medium">
                                Courier: <span className="underline">{made_to_order.courier.name.toUpperCase()}</span>
                            </div>
                            <div className="text-md font-medium mt-2 sm:mt-0">
                                Packaging: <span className="underline">{made_to_order.packaging_type?.packaging_name?.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="text-md font-medium">
                            Shoulder By: <span className="underline">{made_to_order.shoulder_by.toUpperCase()}</span>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Order Items</h3>
                            <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Product Details</th>
                                        <th className="border px-4 py-2 text-center">Quantity</th>
                                        <th className="border px-4 py-2 text-center">Unit Price</th>
                                        <th className="border px-4 py-2 text-center">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {made_to_order.items && made_to_order.items.length > 0 ? (
                                    made_to_order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="border px-4 py-2">
                                                {item.made_to_order_product.product_name} - {item.made_to_order_product.color}
                                                {item.made_to_order_product.size && ` - Size: ${item.made_to_order_product.size}`}
                                                {item.made_to_order_product.heel_height && ` - Heel: ${item.made_to_order_product.heel_height} in`}
                                                {item.made_to_order_product.type_of_heel && ` - Type: ${item.made_to_order_product.type_of_heel}`}
                                                {item.made_to_order_product.round && ` - Round: ${item.made_to_order_product.round}`}
                                                {item.made_to_order_product.length && ` - Length: ${item.made_to_order_product.length}`}
                                                {item.made_to_order_product.back_strap && ` - Back Strap: ${item.made_to_order_product.back_strap}`}
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                {parseFloat(item.unit_price).toFixed(2)}
                                            </td>
                                            <td className="border px-4 py-2 text-center">₱{parseFloat(item.total_price).toFixed(2)}</td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="border px-4 py-2 text-center" colSpan="4">
                                            No items found
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            </div>
                        </div>

                        {/* Packaging Details */}
                        {made_to_order.packaging_type && (
                            <div>
                            <h3 className="text-xl font-semibold mb-3">Packaging Details</h3>
                            <p className="text-gray-700">
                                Type: <span className="underline">{made_to_order.packaging_type.packaging_name}</span>
                            </p>
                            <p className="text-gray-700">
                                Description: <span className="underline">{made_to_order.packaging_type.description}</span>
                            </p>
                            </div>
                        )}

                        {/* Payment Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Payment Information</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-4 py-2 text-left">Payment Method</th>
                                            <th className="border px-4 py-2 text-center">Amount Paid</th>
                                            <th className="border px-4 py-2 text-center">Change Due</th>
                                            <th className="border px-4 py-2 text-center">Excess</th>
                                            <th className="border px-4 py-2 text-center">Balance</th>
                                            <th className="border px-4 py-2 text-center">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {made_to_order.payments && made_to_order.payments.length > 0 ? (
                                            made_to_order.payments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-gray-50 transition">
                                                    <td className="border px-4 py-2">{payment.payment_method.name}</td>
                                                    <td className="border px-4 py-2 text-center">₱{payment.amount_paid}</td>
                                                    <td className="border px-4 py-2 text-center">₱{payment.change_due}</td>
                                                    <td className="border px-4 py-2 text-center">₱{payment.excess_amount}</td>
                                                    <td className="border px-4 py-2 text-center">₱{payment.remaining_balance}</td>
                                                    <td className="border px-4 py-2 text-center">{formatDate(payment.created_at)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="border px-4 py-2 text-center" colSpan="6">
                                                    No payment records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Customer Information</h3>
                                {made_to_order.customers ? (
                                    <div className="space-y-1">
                                        <p className="text-gray-700 font-medium">
                                            {made_to_order.customers.first_name} {made_to_order.customers.last_name}
                                        </p>
                                        <p className="text-gray-700">Email: {made_to_order.customers.email}</p>
                                        <p className="text-gray-700">Phone: {made_to_order.customers.phone}</p>
                                        <p className="text-gray-700">Address: {made_to_order.customers.address}</p>
                                        {made_to_order.customers.receiver_name && (
                                            <p className="text-gray-700">
                                                Receiver: {made_to_order.customers.receiver_name}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-700">No customer information available.</p>
                                )}
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                            <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
                            <div className="space-y-1">
                                <p className="text-gray-700">Subtotal: ₱{parseFloat(made_to_order.total_amount).toFixed(2)}</p>
                                <p className="text-gray-700">VAT (12%): ₱{parseFloat(made_to_order.total_amount * 0.12).toFixed(2)}</p>
                                <p className="text-gray-700">
                                    VAT Amount: ₱{parseFloat(made_to_order.total_amount * (1 - 0.12)).toFixed(2)}
                                </p>
                                <p className="text-gray-700">Shipping Cost: ₱{parseFloat(made_to_order.shipping_cost).toFixed(2)}</p>
                                <p className="text-gray-700">Rush Order Fee: ₱{parseFloat(made_to_order.rush_order_fee).toFixed(2)}</p>
                                <p className="text-gray-900 font-bold">
                                    Grand Total: ₱{parseFloat(made_to_order.grand_amount).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Remarks / Note */}
                        <div className="border-t pt-4">
                            <h3 className="text-xl font-semibold mb-3">Remarks / Note</h3>
                            <Textarea
                                className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                                placeholder="Enter any additional remarks..."
                                disabled
                            />
                            <InputError message={errors.remarks} />
                        </div>

                        {/* Update Button */}
                        {/* <div className="flex justify-end">
                            <button
                                onClick={handleUpdate}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                Update
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
  );
};

export default InventoryMTOOrderEdit;
