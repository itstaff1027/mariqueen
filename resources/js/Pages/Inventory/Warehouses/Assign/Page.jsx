import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState } from 'react';

const AssignWarehouses = ({ warehouse, users, assignedUsers }) => {
    const { data, setData, post, delete: destroy, processing, errors } = useForm({
        warehouse_id: warehouse.id,
        user_ids: assignedUsers.map(user => user.id) || [] // Pre-select assigned users
    });

    // Handle User Selection
    const handleCheckboxChange = (userId) => {
        setData('user_ids', prev => 
            prev.includes(userId) 
            ? prev.filter(id => id !== userId) 
            : [...prev, userId]
        );
    };

    // Handle Assigning Users to Warehouse
    const handleAssign = (e) => {
        e.preventDefault();
        post(`/inventory/warehouses/${warehouse.id}/assign-users`);
    };

    // Handle Removing Users from Warehouse
    const handleRemove = (userId) => {
        destroy(`/inventory/warehouses/${warehouse.id}/remove-user/${userId}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Assign Users to {warehouse.name}
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-xl font-semibold mb-6">Manage Warehouse Users</h1>

                            {/* Assign Users Form */}
                            <form onSubmit={handleAssign}>
                                <InputLabel value="Select Users to Assign" />
                                
                                <div className="mb-6">
                                    {users.map(user => (
                                        <div key={user.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`user-${user.id}`}
                                                value={user.id}
                                                checked={data.user_ids.includes(user.id)}
                                                onChange={() => handleCheckboxChange(user.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`user-${user.id}`} className="text-gray-700">
                                                {user.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                
                                <InputError message={errors.user_ids} />

                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={processing}
                                >
                                    Assign Users
                                </button>
                            </form>

                            {/* List of Assigned Users */}
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold mb-4">Assigned Users</h2>
                                {assignedUsers.length > 0 ? (
                                    <ul>
                                        {assignedUsers.map(user => (
                                            <li key={user.id} className="flex justify-between items-center border-b py-2">
                                                <span>{user.name}</span>
                                                <button
                                                    onClick={() => handleRemove(user.id)}
                                                    className="bg-red-500 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                                                    disabled={processing}
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
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
