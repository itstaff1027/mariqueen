import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const AssignWarehouses = ({ warehouses, users, assignedUsers }) => {
    const { data, setData, post, delete: destroy, processing, errors } = useForm({
        warehouse_id: 0,
        user_ids: [] // Pre-select assigned users
    });

    // Handle Warehouse Selection Change
    const handleWarehouseChange = (e) => {
        setData('warehouse_id', e.target.value);
    };

    // Handle selecting a user (Assign)
    const handleSelectUser = (user) => {
        if (!data.user_ids.includes(user.id)) {
            setData('user_ids', [...data.user_ids, user.id]);
        }
    };

    // Handle removing a selected user (Unassign)
    const handleRemoveUser = (userId) => {
        setData('user_ids', data.user_ids.filter(id => id !== userId));
    };

    // Handle Form Submission (Assign Users)
    const handleAssign = (e) => {
        e.preventDefault();
        console.log(data)
        post(`/inventory/warehouses/${data.warehouse_id}/assign-users`);
    };

    // Handle Removing Users from Warehouse
    const handleRemove = (userId) => {
        destroy(`/inventory/warehouses/${data.warehouse_id}/remove-user/${userId}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Assign Users to Warehouses
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-xl font-semibold mb-6">Manage Warehouse Users</h1>

                            {/* Warehouse Selection Dropdown */}
                            <div className="mb-6">
                                <InputLabel value="Select Warehouse" />
                                <select
                                    value={data.warehouse_id}
                                    onChange={handleWarehouseChange}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="" disabled>Select a Warehouse</option>
                                    {warehouses.map(warehouse => (
                                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.warehouse_id} />
                            </div>

                            {/* Assign Users Form */}
                            <form onSubmit={handleAssign} className="mb-8">
                                <InputLabel value="Assign Users to Warehouse" />

                                {/* Selected Users Section */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {data.user_ids.map((userId, index) => {
                                        const user = users.find(u => u.id === userId);
                                        return (
                                            <span
                                                key={index}
                                                className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                            >
                                                {user?.name}
                                                <button
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                    onClick={() => handleRemoveUser(userId)} // Remove user
                                                    aria-label={`Remove ${user?.name}`}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Available Users Section */}
                                <div className="grid grid-cols-4 gap-4">
                                    {users.map((user, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectUser(user)}
                                            className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                                                data.user_ids.includes(user.id)
                                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-blue-100 hover:border-blue-400"
                                            }`}
                                            disabled={data.user_ids.includes(user.id)} // Disable if already selected
                                        >
                                            {user.name}
                                        </button>
                                    ))}
                                </div>

                                <InputError message={errors.user_ids} />

                                <button
                                    type="submit"
                                    className="mt-4 bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={processing}
                                >
                                    Assign Users
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AssignWarehouses;
