import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const EditPaymentMethod = ({ payment_method }) => {
    const { data, setData, put, errors } = useForm({
        name: payment_method.name || "",
        is_active: payment_method.is_active || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/payment_methods/${payment_method.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Payment Method
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
                                    <InputLabel for="name" value="Payment Method Name" />
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
                                    <InputLabel for="is_active" value="Is Active (1 = Active : 0 = In_Active)" />
                                    <TextInput
                                        id="is_active"
                                        name="is_active"
                                        type="number"
                                        value={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.value)}
                                        className="w-full"
                                        max={1}
                                        min={0}
                                    />
                                    <InputError message={errors.value} />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Edit Payment Method
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditPaymentMethod;
