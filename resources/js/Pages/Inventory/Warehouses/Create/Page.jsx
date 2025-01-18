import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const CreateWarehouse = ({ Warehouse }) => {
    const { data, setData, post, errors } = useForm({
        name: '',
        location: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/inventory/warehouses');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Warehouses
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-xl font-semibold mb-6">Create Warehouse</h1>
                            <form onSubmit={handleSubmit}>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="name" value="Warehouse Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* location Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="location" value="Location Code" />
                                    <TextInput
                                        id="location"
                                        name="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Create Warehouse
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateWarehouse;
