import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const Edit = ({ routes, role }) => {
    const { data, setData, post, errors } = useForm({
        role_id: role.id || '',
        assigned_routes:  role.routes.map((routeObj) => routeObj.route_name) || [],
    });

    // Create a sorted copy of routes by name (alphabetically)
    const sortedRoutes = routes.slice().sort((a, b) => a.name.localeCompare(b.name));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(`/admin-routes`); // Send a PUT request
    };

    const handleSelectAll = () => {
        const allRouteNames = sortedRoutes.map(route => route.name);
        // Check if all routes are already selected
        const allSelected = allRouteNames.every(name => data.assigned_routes.includes(name)) &&
                            data.assigned_routes.length === allRouteNames.length;
        if (allSelected) {
            // If all are selected, unselect all
            setData('assigned_routes', []);
        } else {
            // Otherwise, select all routes
            setData('assigned_routes', allRouteNames);
        }
    };

    useEffect(() => {
        console.log(sortedRoutes);
        console.log(role.routes);
    }, [sortedRoutes, role]);

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
                                        value={role.name}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                                    />
                                </div>

                                {/* Permissions Checkbox List */}
                                <div>
                                    <label
                                        htmlFor="permissions"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Routes
                                    </label>
                                    {/* "Select All" Button */}
                                    <div className="mb-4">
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        >
                                            Select All
                                        </button>
                                    </div>
                                    <div
                                        id="routes"
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                    >
                                        {sortedRoutes.map((route) => (
                                            <div key={route.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`route-${route.id}`}
                                                    value={route.name}
                                                    checked={data.assigned_routes.includes(route.name)}
                                                    onChange={(e) => {
                                                        const newRoutes = e.target.checked
                                                            ? [...data.assigned_routes, route.name]
                                                            : data.assigned_routes.filter(
                                                                  (p) => p !== route.name
                                                              );
                                                        setData('assigned_routes', newRoutes);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <label
                                                    htmlFor={`route-${route.id}`}
                                                    className="ml-2 text-sm text-gray-700"
                                                >
                                                    {route.name}
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
