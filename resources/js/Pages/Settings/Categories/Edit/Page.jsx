import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const EditCategories = ({ category }) => {
    const { data, setData, put, errors } = useForm({
        name: category.category_name || '',
        label: category.category_label || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/settings_categories/${category.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Categories/Item Group
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-xl font-semibold mb-6">Edit Categories/Item Group</h1>
                            <form onSubmit={handleSubmit}>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="name" value="Categories/Item Group Name" />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* label Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="label" value="Label Code - Gender ['male', 'female', 'others']" />
                                    <TextInput
                                        id="label"
                                        name="label"
                                        value={data.label}
                                        onChange={(e) => setData('label', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.label} />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Edit Categories
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditCategories;
