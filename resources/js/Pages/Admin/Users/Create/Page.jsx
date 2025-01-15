import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const CreateUser = ({ roles }) => {
    const { data, setData, post, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '', // Add confirmation field
        roles: [], // Array of role IDs
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin-users');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1>Create User</h1>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label  className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.name && <div>{errors.name}</div>}
                                </div>
                                <div>
                                    <label  className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.email && <div>{errors.email}</div>}
                                </div>
                                <div >
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.password && <div>{errors.password}</div>}
                                </div>
                                <div>
                                    <label  className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.password_confirmation && <div>{errors.password_confirmation}</div>}
                                </div>
                                <div>
                                    <label  className="block text-gray-700 text-sm font-bold mb-2">Roles</label>
                                    {roles.map((role) => (
                                        <div className="mb-2" key={role.id}>
                                            <input
                                                type="checkbox"
                                                value={role.id}
                                                onChange={(e) =>
                                                    setData('roles', e.target.checked
                                                        ? [...data.roles, role.id]
                                                        : data.roles.filter((id) => id !== role.id)
                                                    )
                                                }
                                                className="form-checkbox"
                                            />
                                            <span className="ml-2">{role.name}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateUser;
