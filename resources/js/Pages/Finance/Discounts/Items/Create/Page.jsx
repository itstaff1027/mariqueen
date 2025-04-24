import React, { useEffect, useState } from 'react';
import { useForm, router, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const CreateDiscountPerItems = ({ discount, products }) => {
    const { data, setData, post, errors, reset } = useForm({
        discount_id: discount.id,
        discount_name: discount.name || '',
        type: discount.type || 'fixed',
        discount_value: discount.value || '',
        discount_for: discount.discount_for || '',
        is_active: discount.is_active || '0',
        items: discount.items || [],
        product_id: ''
    });

    const auth = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/discount_per_items`, {
            preserveState: false,
            onFinish: () => reset(),
        });
    };

    useEffect(() => {
        console.log(auth);
        console.log(products)
    }, [])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Discount
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {
                                auth.flash.success && <div className="my-4 bg-emerald-100 p-4 w-full border border-emerald-500 rounded-xl">
                                    <p className="text-emerald-600 text-sm">{auth.flash.success}</p>
                                </div>
                            }
                            
                            <div>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel
                                        for="discount_name"
                                        value="Discount's Name"
                                    />
                                    <TextInput
                                        id="discount_name"
                                        name="discount_name"
                                        value={data.discount_name}
                                        className="w-full border-none"
                                        disabled
                                    />
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        for="discount_name"
                                        value="Discount Value"
                                    />
                                    <TextInput
                                        id="discount_name"
                                        name="discount_name"
                                        value={`${data.type.toUpperCase()} - ${data.discount_value}`}
                                        className="w-full border-none"
                                        disabled
                                    />
                                </div>

                                <div className="mb-6">
                                    <InputLabel
                                        for="products"
                                        value="Select Product"
                                    />
                                    <select
                                        className="w-full rounded-lg border border-slate-200"
                                        onChange={(e) =>
                                            setData(
                                                'product_id',
                                                e.target.value,
                                            )
                                        }
                                        value={data.product_id}
                                    >
                                        <option value="">Select Product</option>
                                        {products?.map((product, index) => (
                                            <option
                                                key={index}
                                                value={product.id}
                                            >
                                                {product.product_name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={auth.errors.product_id} />
                                </div>

                                <button
                                    type="submit"
                                    className="focus:shadow-outline rounded bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                                    onClick={handleSubmit}
                                >
                                    Add Items
                                </button>

                                <div className="py-2">
                                    <InputLabel
                                        for="discount_name"
                                        value="Discounted Items"
                                    />
                                    <table className="w-full table-fixed">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Product Name</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {discount.items?.map(
                                                (items, index) => (
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {items.product.product_name}
                                                        </td>
                                                        <td>
                                                            <Link
                                                                // href={`/discount_per_items/${discount.id}`}
                                                                method="delete"
                                                                className="text-red-500 hover:underline"
                                                                as="button"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault(); // Prevent default link behavior
                                                                    if (
                                                                        confirm(
                                                                            'Are you sure you want to remove this Item?',
                                                                        )
                                                                    ) {
                                                                        // Perform the deletion
                                                                        router.delete(route('discount_per_items.destroy', items.id));
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ),
                                            ) || (
                                                <div className="text-s w-full p-4 text-center text-gray-500">
                                                    No Items found.
                                                </div>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateDiscountPerItems;
