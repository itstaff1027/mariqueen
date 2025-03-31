import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const PackagingTypeIndex = ({ packaging_types }) => {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Product Packaging Types
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between mb-4">
                                <h1 className="text-lg font-semibold">Packaging Type List</h1>
                                <Link
                                    href="/inventory_packaging_types/create"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Create New Packaging Type
                                </Link>
                            </div>

                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">#</th>
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2">Description</th>
                                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packaging_types?.map((packaging_type, index) => (
                                        <tr key={packaging_type.id}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {packaging_type.packaging_name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {packaging_type.description}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <Link
                                                    href={`/inventory_packaging_types/${packaging_type.id}/edit`}
                                                    className="text-blue-500 hover:underline mr-2"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/inventory_packaging_types/${packaging_type.id}`}
                                                    method="delete"
                                                    className="text-red-500 hover:underline"
                                                    as="button"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Prevent default link behavior
                                                        if (confirm("Are you sure you want to remove this packaging_type?")) {
                                                            // Perform the deletion
                                                            router.delete(`/inventory_packaging_types/${packaging_type.id}`);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Link>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default PackagingTypeIndex;
