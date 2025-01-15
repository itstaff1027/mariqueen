import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Edit = ({ user, roles, userRoles }) => {
    const { data, setData, put, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        roles: userRoles.roles.map(role => role.name) || [],
        password: "", // New password
        password_confirmation: "", // Confirm password
    });

    const handleRoleChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            setData("roles", [...data.roles, value]);
        } else {
            setData(
                "roles",
                data.roles.filter((role) => role !== value)
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin-users/${user.id}`);
    };

    useEffect(() => {
        console.log(userRoles);
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit User
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-2">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-2">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="Leave blank to keep current password"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-2">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-red-500 text-xs mt-2">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Roles
                                    </label>
                                    {roles.map((role) => (
                                        <div key={role.id} className="mb-2">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={role.name}
                                                    checked={data.roles.includes(
                                                        role.name
                                                    )}
                                                    onChange={(e) => {
                                                        const newRoles =
                                                            e.target.checked
                                                                ? [
                                                                      ...data.roles,
                                                                      role.name,
                                                                  ]
                                                                : data.roles.filter(
                                                                      (r) =>
                                                                          r !==
                                                                          role.name
                                                                  );
                                                        setData("roles", newRoles);
                                                    }}
                                                    className="form-checkbox"
                                                />
                                                <span className="ml-2">
                                                    {role.name}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                                    {errors.roles && (
                                        <p className="text-red-500 text-xs mt-2">
                                            {errors.roles}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Update
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
