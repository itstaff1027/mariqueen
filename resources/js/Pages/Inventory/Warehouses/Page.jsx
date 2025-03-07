import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const WarehouseList = ({ Warehouses }) => {

    const destroy = (e, id) => {
        e.preventDefault();

        if (confirm('Are you sure?')){
            router.delete(`/inventory/warehouses/${id}`);
        }
    };
    
    return(
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Warehouses Management
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Warehouses</h1>
                                    <Link
                                        href="/inventory/warehouses/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Add Warehouse
                                    </Link>
                                    {/* <Link
                                        href="/inventory/warehouse/assign_warehouse"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Assign User to Warehouse
                                    </Link> */}
                                </div>
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2">Name</th>
                                            <th className="border border-gray-300 px-4 py-2">Location</th>
                                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Warehouses.map((Warehouse) => (
                                        <tr key={Warehouse.id}>
                                            <td className="border border-gray-300 px-4 py-2">{Warehouse.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{Warehouse.location}</td>
                                            <td className="border border-gray-300 px-6 py-3 space-x-2">
                                                <Link
                                                    href={`/inventory/warehouses/${Warehouse.id}/edit`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/inventory/warehouse/assign_warehouse/${Warehouse.id}`}
                                                    className="text-yellow-500 hover:underline"
                                                >
                                                    Assign
                                                </Link>
                                                <Link
                                                    href={`/inventory/warehouses/${Warehouse.id}`}
                                                    className="text-emerald-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/inventory/warehouses/${Warehouse.id}/ledger/`}
                                                    className="text-emerald-500 hover:underline"
                                                >
                                                    Ledger
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={(e) => destroy(e, Warehouse.id)}
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
    )
};

export default WarehouseList;
