import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const EditdCourier = ({ courier }) => {
    const { data, setData, put, errors } = useForm({
        name: courier.name || "",
        fixed_shipping_cost: courier.fixed_shipping_cost || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/couriers/${courier.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Courier
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="name" value="Courier's Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* value Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="fixed_shipping_cost" value="Fixed Amount of Courier Cost" />
                                    <TextInput
                                        id="fixed_shipping_cost"
                                        name="fixed_shipping_cost"
                                        type="number"
                                        value={data.fixed_shipping_cost}
                                        onChange={(e) => setData('fixed_shipping_cost', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.value} />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Edit Courier
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditdCourier;
