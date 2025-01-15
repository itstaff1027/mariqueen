import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Admin = ({ csrf_token }) => {
    const { roles, flash } = usePage().props;

    const destroy = (e, id) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(`admin-panel/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Panel - Roles Management
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Roles Management
                                </h1>
                                <Link
                                    href="/admin-panel/create"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                >
                                    Add Role
                                </Link>
                            </div>
                            {flash?.success && (
                                <p className="mb-4 text-sm text-green-500">
                                    {flash.success}
                                </p>
                            )}
                            <table className="w-full border-collapse border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b">
                                            Name
                                        </th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 border-b">
                                            Permissions
                                        </th>
                                        <th className="px-4 py-2 text-center text-sm font-semibold text-gray-600 border-b">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.length > 0 ? (
                                        roles.map((role) => (
                                            <tr key={role.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-800 border-b">
                                                    {role.name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600 border-b">
                                                    {role.permissions
                                                        .map((p) => p.name)
                                                        .join(', ')}
                                                </td>
                                                <td className="px-4 py-3 text-center border-b">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Link
                                                            href={`/admin-panel/${role.id}/edit`}
                                                            className="px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => destroy(e, role.id)}
                                                            className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-4 py-3 text-center text-gray-500 border-b"
                                            >
                                                No roles found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Admin;
