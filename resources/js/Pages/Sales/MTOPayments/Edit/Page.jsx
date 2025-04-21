import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const EditMTOSalesPayments = ({ mto_sales_payment, payment_methods }) => {
    const { data, setData, put, errors } = useForm({
        mto_sales_payment_id: mto_sales_payment.id || '',
        order_number: mto_sales_payment.sales_order.mto_order_number || '',
        payment_method_id: mto_sales_payment.payment_method_id || '',
        status: mto_sales_payment.status || '',
        client_payment_amount: mto_sales_payment.amount_paid || '',
        grand_total: mto_sales_payment.sales_order.grand_amount || '',
        remarks: mto_sales_payment.remarks || '',
        payment_images: Array.isArray(mto_sales_payment.payment_images) ? mto_sales_payment.payment_images : [],
    }); 

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/mto_sales_payments/${mto_sales_payment.id}`);
    };

    useEffect(() => {
        console.log(mto_sales_payment);
        console.log(data.payment_images)
    }, []);

    // Create a separate local state to manage image changes temporarily.
    const [localImages, setLocalImages] = useState(data.payment_images);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    

    useEffect(() => {
        console.log("Sales Payment:", mto_sales_payment.id);
        console.log("Local Images:", localImages);

    }, [mto_sales_payment, localImages]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };
    
    const removeFile = (indexToRemove) => {
        // Filter out the file at the specified index
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);
    };

    const submitNewImages = (e) => {
        // console.log(data);
        router.post(
            `/mto_sales_payment/upload/images`,
            { 
                data: {
                    mto_sales_payment_id: mto_sales_payment.id,
                    new_images: selectedFiles
                } 
            },
            { preserveState: true },
        );
    }

    const destroyImage = (payment_image_id) => {
        // console.log(data);
        // e.preventDefault();
        // console.log(payment_image_id)
        router.post(
            `/mto_sales_payment/destroy/image`,
            {
                payment_image_id: payment_image_id,
                mto_sales_payment_id: mto_sales_payment.id,
            },
            { preserveState: true },
        );
    }
      
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit mto_sales_payments
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel
                                        for="order_number"
                                        value="mto_sales_payments - Order Number"
                                    />
                                    <TextInput
                                        id="order_number"
                                        name="order_number"
                                        value={data.order_number}
                                        onChange={(e) =>
                                            setData(
                                                'order_number',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full"
                                        disabled
                                    />
                                    <InputError message={errors.order_number} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        for="paymenet_method_id"
                                        value="mto_sales_payments - Payment Method"
                                    />
                                    <select
                                        id="payment_method_id"
                                        value={data.payment_method_id}
                                        onChange={(e) =>
                                            setData(
                                                'payment_method_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded border p-2"
                                    >
                                        <option value="">
                                            Select Payment Method
                                        </option>
                                        {payment_methods.map((method) => (
                                            <option
                                                key={method.id}
                                                value={method.id}
                                            >
                                                {method.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.payment_method_id}
                                    />
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        for="status"
                                        value="mto_sales_payment - Status"
                                    />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.value)
                                        }
                                        className="w-full rounded border p-2"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="paid">Paid</option>
                                        <option value="partial">Partial</option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        for="client_payment_amount"
                                        value="mto_sales_payments - client_payment_amount"
                                    />
                                    <TextInput
                                        id="client_payment_amount"
                                        name="client_payment_amount"
                                        value={data.client_payment_amount}
                                        onChange={(e) =>
                                            setData(
                                                'client_payment_amount',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full"
                                        disabled
                                    />
                                    <InputError
                                        message={errors.client_payment_amount}
                                    />
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        for="grand_total"
                                        value="mto_sales_payments - grand_total"
                                    />
                                    <TextInput
                                        id="grand_total"
                                        name="grand_total"
                                        value={data.grand_total}
                                        onChange={(e) =>
                                            setData(
                                                'grand_total',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full"
                                        disabled
                                    />
                                    <InputError message={errors.grand_total} />
                                </div>

                                {/* value Input Field */}
                                <div className="mb-6">
                                    <InputLabel
                                        for="remarks"
                                        value="mto_sales_payments - Remarks"
                                    />
                                    <TextInput
                                        id="remarks"
                                        name="remarks"
                                        type="text"
                                        value={data.remarks}
                                        onChange={(e) =>
                                            setData('remarks', e.target.value)
                                        }
                                        className="w-full"
                                    />
                                    <InputError message={errors.remarks} />
                                </div>

                                <div className="p-4">
                                    {/* Thumbnail Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {mto_sales_payment.payment_images.map((img, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={`/storage/${img.image}`}
                                                    alt="Payment"
                                                    className="w-full h-24 object-cover rounded cursor-pointer"
                                                    onClick={() => setSelectedImage(img)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (window.confirm("Are you sure you want to remove this image?")) {
                                                        destroyImage(img.id);
                                                        }
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Preview Modal */}
                                    {selectedImage && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                                            <div className="relative">
                                                <img
                                                    src={`/storage/${selectedImage.image}`}
                                                    alt="Preview"
                                                    className="max-h-full max-w-full rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedImage(null)}
                                                    className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                
                                <div>
                                    <h1 className="text-2xl font-bold mb-4">Upload Payment Images (Multiple Allowed)</h1>
                                    <input
                                        type="file"
                                        name="new_images"
                                        multiple
                                        onChange={handleFileChange}
                                        className="border p-2 rounded"
                                    />
                                    {errors.new_images && (
                                        <div className="text-red-500 mt-2">{errors.new_images}</div>
                                    )}

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4">
                                            <h2 className="text-lg font-bold">Selected Files:</h2>
                                            <ul className="list-disc list-inside">
                                                {selectedFiles.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-gray-700 flex items-center justify-between"
                                                    >
                                                        {file.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 ml-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <button
                                        onClick={submitNewImages}
                                        type="submit"
                                        className="focus:shadow-outline rounded bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-emerald-700 focus:outline-none"
                                    >
                                        Upload New Images
                                    </button>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="focus:shadow-outline rounded bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-emerald-700 focus:outline-none"
                                >
                                    Edit mto_sales_payments
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditMTOSalesPayments;
