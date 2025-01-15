import React from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ValueSize = ({ size, size_values }) => {
    const { data, setData, post, errors, reset } = useForm({
        size_value: '',
        size_id: size.id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/settings_size_values', {
            onSuccess: () => {
                reset('size_value');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Size Values
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-6">
                            <h1 className="text-2xl font-bold text-gray-700">{size.size_name}</h1>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-gray-700"
                                        htmlFor="size_value"
                                    >
                                        Add Size Values
                                    </label>
                                    <p className="text-sm text-gray-500">
                                        Enter multiple sizes separated by commas (e.g., "35,36,37"). For a single value, enter one number.
                                    </p>
                                    <input
                                        type="text"
                                        id="size_value"
                                        name="size_value"
                                        value={data.size_value}
                                        onChange={(e) => setData('size_value', e.target.value)}
                                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-emerald-300 focus:outline-none"
                                        placeholder="Enter size values"
                                    />
                                    {errors.size_value && (
                                        <p className="mt-2 text-sm text-red-500">{errors.size_value}</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring focus:ring-emerald-300"
                                >
                                    Add Size Values
                                </button>
                            </form>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Existing Size Values</h2>
                                <div className="overflow-x-auto mt-4">
                                    <table className="w-full text-sm text-left border border-gray-200 rounded-lg shadow-sm">
                                        <thead className="bg-gray-100 text-gray-600">
                                            <tr>
                                                <th className="px-4 py-2 border-b">#</th>
                                                <th className="px-4 py-2 border-b">Size Value</th>
                                                <th className="px-4 py-2 border-b text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {size_values?.length > 0 ? (
                                                size_values.map((values, index) => (
                                                    <tr key={values.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border-b">{values.id}</td>
                                                        <td className="px-4 py-2 border-b">{values.size_values}</td>
                                                        <td className="px-4 py-2 border-b text-center space-x-2">
                                                            {/* <Link
                                                                href={`/settings_valuess/${values.id}/edit`}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Edit
                                                            </Link> */}
                                                            <button
                                                                className="text-red-600 hover:underline"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (
                                                                        confirm(
                                                                            'Are you sure you want to remove this value?'
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            `/settings_size_values/${values.id}`
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="3"
                                                        className="px-4 py-2 text-center text-gray-500"
                                                    >
                                                        No size values found.
                                                    </td>
                                                </tr>
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

export default ValueSize;
