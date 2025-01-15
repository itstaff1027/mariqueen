import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const PermissionsIndex = ({ permissions }) => {
    const destroy = (e, id) => {
        e.preventDefault();

        if (confirm('Are you sure?')){
            router.delete(`/admin-permissions/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-3xl font-bold mb-6">Permissions</h1>
                            <div className="mb-4 flex justify-end">
                                <Link href="/admin-permissions/create" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                    Create Permission
                                </Link>
                            </div>
                            <div className="overflow-x-auto rounded-lg shadow-md">
                                <table className="min-w-full table-auto">
                                    <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                            <th className="px-6 py-3 text-left">ID</th>
                                            <th className="px-6 py-3 text-left">Name</th>
                                            <th className="px-6 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.map(permission => (
                                            <tr key={permission.id} className="border-t">
                                                <td className="px-6 py-3 text-gray-700">{permission.id}</td>
                                                <td className="px-6 py-3 text-gray-700">{permission.name}</td>
                                                <td className="px-6 py-3 space-x-2">
                                                    <Link href={`/admin-permissions/${permission.id}/edit`} className="text-yellow-600 hover:text-yellow-700 transition-colors">
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => destroy(e, permission.id)}
                                                        className="text-red-600 hover:text-red-700 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PermissionsIndex;
