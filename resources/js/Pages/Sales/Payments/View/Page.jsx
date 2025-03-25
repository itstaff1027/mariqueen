import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ViewSalesPayments = ({ sales_payment }) => {
    // Use the form hook to store data, even though we're displaying read-only values.
    const { data } = useForm({
        sales_payment_id: sales_payment.id || '',
        order_number: sales_payment.sales_order.order_number || '',
        payment_method: sales_payment.payment_method.name || '',
        status: sales_payment.status || '',
        client_payment_amount: sales_payment.amount_paid || '',
        grand_total: sales_payment.sales_order.grand_amount || '',
        remarks: sales_payment.remarks || '',
        payment_images: Array.isArray(sales_payment.payment_images)
            ? sales_payment.payment_images
            : [],
    });

    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold text-gray-800">
                    Sales Payment Details
                </h2>
            }
        >
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Document-style details */}
                    <div className="bg-white rounded-lg shadow p-8 mb-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg text-gray-500">Order Number</h3>
                                <p className="mt-1 text-xl text-gray-900">{data.order_number}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-gray-500">Payment Method</h3>
                                <p className="mt-1 text-xl text-gray-900">{data.payment_method}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-gray-500">Status</h3>
                                <p className="mt-1 text-xl text-gray-900">{data.status}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-gray-500">Client Payment Amount</h3>
                                <p className="mt-1 text-xl text-gray-900">{data.client_payment_amount}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-gray-500">Grand Total</h3>
                                <p className="mt-1 text-xl text-gray-900">{data.grand_total}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-gray-500">Remarks</h3>
                                <p className="mt-1 text-xl text-gray-900">{data.remarks}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Images Section */}
                    <div className="bg-white rounded-lg shadow p-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            Payment Images
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            {sales_payment.payment_images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={`/storage/${img.image}`}
                                        alt="Payment"
                                        className="w-full h-24 object-cover rounded cursor-pointer"
                                        onClick={() => setSelectedImage(img)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-4 rounded shadow-lg relative max-w-2xl w-full">
                        <img
                            src={`/storage/${selectedImage.image}`}
                            alt="Preview"
                            className="w-full h-auto rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 bg-gray-200 text-gray-800 px-2 py-1 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default ViewSalesPayments;
