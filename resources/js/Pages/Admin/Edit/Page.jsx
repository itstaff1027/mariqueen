import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Edit = ({ role, permissions, role_has_permission }) => {
    const { data, setData, put, errors } = useForm({
        name: role.name || '',
        permissions: role_has_permission.permissions.map((perm) => perm.name) || [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin-panel/${role.id}`); // Send a PUT request
    };

    useEffect(() => {
        console.log(role_has_permission);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Role
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                                Edit Role
                            </h1>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Role Name Input */}
                                <div>
                                    <label
                                        htmlFor="role-name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Role Name
                                    </label>
                                    <input
                                        id="role-name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                {/* Permissions Checkbox List */}
                                <div>
                                    <label
                                        htmlFor="permissions"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Permissions
                                    </label>
                                    <div
                                        id="permissions"
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                    >
                                        {permissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`permission-${permission.id}`}
                                                    value={permission.name}
                                                    checked={data.permissions.includes(permission.name)}
                                                    onChange={(e) => {
                                                        const newPermissions = e.target.checked
                                                            ? [...data.permissions, permission.name]
                                                            : data.permissions.filter(
                                                                  (p) => p !== permission.name
                                                              );
                                                        setData('permissions', newPermissions);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`permission-${permission.id}`}
                                                    className="ml-2 text-sm text-gray-700"
                                                >
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
