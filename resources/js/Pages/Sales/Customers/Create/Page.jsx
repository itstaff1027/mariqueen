import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const CreatedCustomers = ({ heel_height }) => {
    const { data, setData, post, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        receiver_name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/customers');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Customers
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
                                    <InputLabel for="first_name" value="Customers First Name" />
                                    <TextInput
                                        id="first_name"
                                        name="first_name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="last_name" value="Customers Last Name" />
                                    <TextInput
                                        id="last_name"
                                        name="last_name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="email" value="Customers Email" />
                                    <TextInput
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="phone" value="Customers Phone" />
                                    <TextInput
                                        id="phone"
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="address" value="Customers Address" />
                                    <TextInput
                                        id="address"
                                        name="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                {/* value Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="receiver_name" value="Receiver Name" />
                                    <TextInput
                                        id="receiver_name"
                                        name="receiver_name"
                                        type="text"
                                        value={data.receiver_name}
                                        onChange={(e) => setData('receiver_name', e.target.value)}
                                        className="w-full"
                                    />
                                    <InputError message={errors.receiver_name} />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Create Customers
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreatedCustomers;
