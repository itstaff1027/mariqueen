import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const EditHeelHeight = ({ heel_height }) => {
    const { data, setData, put, errors } = useForm({
        name: heel_height.name || "",
        value: heel_height.value || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/settings_heel-heights/${heel_height.id}`);
    };

    return (
        <AuthenticatedLayout
                    header={
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit Heel Height
                        </h2>
                    }
                >
                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <h1 className="text-xl font-semibold mb-6">Edit Heel Height</h1>
                                    <form onSubmit={handleSubmit}>
                                        {/* Name Input Field */}
                                        <div className="mb-6">
                                            <InputLabel for="name" value="Heel Height Name" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full"
                                                disabled={true}
                                            />
                                            <InputError message={errors.name} />
                                        </div>
        
                                        {/* value Input Field */}
                                        <div className="mb-6">
                                            <InputLabel for="value" value="Value Code" />
                                            <TextInput
                                                id="value"
                                                name="value"
                                                value={data.value}
                                                onChange={(e) => setData('value', e.target.value)}
                                                className="w-full"
                                            />
                                            <InputError message={errors.value} />
                                        </div>
        
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Edit Heel Height
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </AuthenticatedLayout>
    );
};

export default EditHeelHeight;
