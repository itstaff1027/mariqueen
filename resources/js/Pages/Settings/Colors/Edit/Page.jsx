import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const EditColor = ({ colors }) => {
    const { data, setData, put, errors } = useForm({
        name: colors.color_name || "",
        hex: colors.hex || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/settings_colors/${colors.id}`);
    };

    return (
        <AuthenticatedLayout
                    header={
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit Colors
                        </h2>
                    }
                >
                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <h1 className="text-xl font-semibold mb-6">Create Color</h1>
                                    <form onSubmit={handleSubmit}>
                                        {/* Name Input Field */}
                                        <div className="mb-6">
                                            <InputLabel for="name" value="Color Name" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
        
                                        {/* Hex Input Field */}
                                        <div className="mb-6">
                                            <InputLabel for="hex" value="Hex Code" />
                                            <TextInput
                                                id="hex"
                                                name="hex"
                                                value={data.hex}
                                                onChange={(e) => setData('hex', e.target.value)}
                                                className="w-full"
                                            />
                                            <InputError message={errors.hex} />
                                        </div>
        
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        >
                                            Edit Color
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </AuthenticatedLayout>
    );
};

export default EditColor;
