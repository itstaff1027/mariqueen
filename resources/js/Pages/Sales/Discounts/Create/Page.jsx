import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const CreatedDiscounts = ({ }) => {
    const { data, setData, post, errors } = useForm({
        discount_name: '',
        type: 'fixed',
        discount_value: '',
        is_active: '0'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/discounts');
    };

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
                            <form onSubmit={handleSubmit}>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="discount_name" value="Discount's Name" />
                                    <TextInput
                                        id="discount_name"
                                        name="discount_name"
                                        value={data.discount_name}
                                        onChange={(e) => setData('discount_name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.discount_name} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="type" value="Discount's Type" />
                                    <select
                                        id='type'
                                        name='type'
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                    >
                                        <option value='fixed'>Fixed</option>
                                        <option value='percentage'>Percentage</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="discount_value" value="Discount's Value" />
                                    <TextInput
                                        id="discount_value"
                                        name="discount_value"
                                        value={data.discount_value}
                                        onChange={(e) => setData('discount_value', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.discount_value} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="is_active" value="Discount's Status" />
                                    <select
                                        id='is_active'
                                        name='is_active'
                                        value={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.value)}
                                    >
                                        <option value='0'>In-Active</option>
                                        <option value='1'>Active</option>
                                    </select>
                                    <InputError message={errors.is_active} />
                                </div>


                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Create Discounts
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreatedDiscounts;
