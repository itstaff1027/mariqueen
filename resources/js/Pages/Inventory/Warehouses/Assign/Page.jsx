import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const AssignWarehouses = ({ warehouses, users, assignedUsers }) => {
    const { data, setData, post, delete: destroy, processing, errors } = useForm({
        warehouse_id: warehouses.id,
        user_ids: assignedUsers
            .filter(user => user.warehouse_id === warehouses.id) // Filter users based on selected warehouse
            .map(user => ({ id: user.id })) || [] // Then map to objects with { id: user.id }
    });

    // Handle selecting a user (Assign)
    const handleSelectUser = (user) => {
        if (!data.user_ids.some(u => u.id === user.id)) {
            setData('user_ids', [...data.user_ids, { id: user.id }]); // Store as object
        }
    };

    // Handle removing a selected user (Unassign)
    const handleRemoveUser = (userId) => {
        setData('user_ids', data.user_ids.filter(user => user.id !== userId));
    };

    // Handle Form Submission (Assign Users)
    const handleAssign = (e) => {
        e.preventDefault();
        console.log(data); // Debugging output
        post(`/inventory/warehouse/assign_warehouse`);
    };

    // Handle Removing Users from Warehouse
    const handleRemove = (userId) => {
        destroy(`/inventory/warehouse/assign_warehouse/${userId}`);
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

                            {/* Warehouse Selection Display */}
                            <div className="mb-6">
                                <InputLabel value="Selected Warehouse" />
                                <h1 className="text-lg font-semibold">{warehouses.name}</h1>
                                <InputError message={errors.warehouse_id} />
                            </div>

                            {/* Assign Users Form */}
                            <div className="mb-8">
                                <InputLabel value="Assign Users to Warehouse" />

                                {/* Selected Users Section */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {data.user_ids.map((userObj, index) => {
                                        const user = users.find(u => u.id === userObj.id);
                                        const isAssignedToSelectedWarehouse = assignedUsers.some(
                                            assigned => assigned.user_id === userObj.id && assigned.warehouse_id === data.warehouse_id
                                        );

                                        return (
                                            user && (
                                                <span
                                                    key={index}
                                                    className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                                                >
                                                    {user.name}
                                                    {isAssignedToSelectedWarehouse ? null : ( // Hide "×" only if the user is already assigned to the selected warehouse
                                                        <button
                                                            className="ml-2 text-red-500 hover:text-red-700"
                                                            onClick={() => handleRemoveUser(userObj.id)} // Remove user
                                                            aria-label={`Remove ${user.name}`}
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </span>
                                            )
                                        );
                                    })}
                                </div>

                                {/* Available Users Section */}
                                <div className="grid grid-cols-4 gap-4">
                                    {users.map((user, index) => {
                                        const isSelected = data.user_ids.some(u => u.id === user.id);
                                        const isAssignedToSelectedWarehouse = assignedUsers.some(
                                            assigned => assigned.user_id === user.id && assigned.warehouse_id === data.warehouse_id
                                        );

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleSelectUser(user)}
                                                className={`border px-4 py-2 rounded-lg text-center text-sm font-medium transition ${
                                                    isAssignedToSelectedWarehouse
                                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Disable only for the selected warehouse
                                                        : "hover:bg-blue-100 hover:border-blue-400"
                                                }`}
                                                disabled={isAssignedToSelectedWarehouse} // Only disable users assigned to the selected warehouse
                                            >
                                                {user.name}
                                            </button>
                                        );
                                    })}
                                </div>

                                <InputError message={errors.user_ids} />

                                <button
                                    type="submit"
                                    onClick={handleAssign}
                                    className="mt-4 bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={processing}
                                >
                                    Assign Users
                                </button>
                            </div>

                            {/* List of Assigned Users with Remove Button */}
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold mb-4">Assigned Users</h2>
                                {assignedUsers.filter(au => au.warehouse_id === data.warehouse_id).length > 0 ? (
                                    <ul>
                                        {assignedUsers
                                            .filter(assignedUser => assignedUser.warehouse_id === data.warehouse_id) // Only show users for the selected warehouse
                                            .map(assignedUser => {
                                                const user = users.find(u => u.id === assignedUser.user_id); // Find full user info
                                                return user ? (
                                                    <li key={user.id} className="flex justify-between items-center border-b py-2">
                                                        <span>{user.name}</span>
                                                        <button
                                                            onClick={() => handleRemove(user.id)} // Remove only for the selected warehouse
                                                            className="bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                                                            disabled={processing}
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ) : null; // Return null if no user is found
                                            })
                                            .filter(Boolean)} {/* Remove null values */}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No users assigned.</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AssignWarehouses;
