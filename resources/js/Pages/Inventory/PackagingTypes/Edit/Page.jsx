import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Textarea } from '@headlessui/react';

const EditPackagingType = ({ packaging_type }) => {
    const { data, setData, put, errors } = useForm({
        packaging_id: packaging_type.id || '',
        packaging_name: packaging_type.packaging_name || '',
        description: packaging_type.description || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/inventory_packaging_types/${data.packaging_id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Packaging Types
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-xl font-semibold mb-6">Edit Packaging Type</h1>
                            <form onSubmit={handleSubmit}>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="packaging_name" value="Packaging Type Name" />
                                    <TextInput
                                        id="packaging_name"
                                        name="packaging_name"
                                        value={data.packaging_name}
                                        onChange={(e) => setData('packaging_name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.packaging_name} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="description" value="Packaging Type Descprition" />
                                    <Textarea 
                                        id="description" 
                                        name="description" 
                                        value={data.description} 
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full" 
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Edit Packaging Type
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditPackagingType;
