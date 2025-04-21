import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    // Get user info from Inertia, and assume allowedRoutes is included
    const { auth } = usePage().props;
    const user = auth.user;

    // allowedRoutes should be an array of route names the user is permitted to access.
    // For example: ['dashboard', 'admin-users.index', 'inventory', ...]
    const allowedRoutes = user.allowed_routes || [];

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Define your navigation paths
    const paths = [
        { id: '0', name: 'Dashboard', collapsed_name: 'D', route: 'dashboard' },
        { id: '1', name: 'Admin Users', collapsed_name: 'AU', route: 'admin-users.index' },
        { id: '2', name: 'Admin Permissions', collapsed_name: 'APE', route: 'admin-permissions.index' },
        { id: '3', name: 'Admin Panel', collapsed_name: 'AP', route: 'admin-panel.index' },
        { id: '4', name: 'Admin Routes', collapsed_name: 'AR', route: 'admin-routes.index' },
        { id: '5', name: 'Inventory', collapsed_name: 'INV', route: 'inventory' },
        { id: '6', name: 'Sales', collapsed_name: 'SS', route: "sales" },
        { id: '7', name: 'Logisitcs', collapsed_name: 'L', route: 'logistics' },
        { id: '8', name: 'Finance', collapsed_name: 'F', route: 'finance' },
        { id: '9', name: 'Settings', collapsed_name: 'S', route: 'settings' }
        // Add or remove paths as needed
    ];
    useEffect(() => {
        // console.log(user.allowed_routes);
        // console.log('allowedRoutes:', user);
    }, [])


    // Filter the paths based on allowedRoutes. If allowedRoutes is empty, you may choose to show all.
    // Convert allowedRoutes to an array of strings:
    const allowedRouteNames = allowedRoutes.map((routeObj) => routeObj.route_name);

    // Then filter your paths:
    const filteredPaths = allowedRouteNames.length > 0 
        ? paths.filter((path) => allowedRouteNames.includes(path.route))
        : [];


    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className={`flex flex-col ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white border-r`}>
                <div className="flex flex-col items-center justify-center py-6 px-4">
                    <Link href="/" className="block">
                        <ApplicationLogo className="h-9 w-auto fill-current text-gray-800" />
                    </Link>
                </div>
                <div className="flex flex-col space-y-1 p-2">
                    {filteredPaths.length > 0 && filteredPaths?.map((path, i) => (
                        <Link
                            key={i}
                            href={route(path.route)}
                            className={`block p-3 rounded-md text-gray-700 hover:bg-gray-200 ${route().current(path.route) ? 'bg-gray-300' : ''}`}
                        >
                            {collapsed 
                                ? <div className="flex text-center">{path.collapsed_name}</div>
                                : path.name
                            }
                        </Link>
                    )) || <div className="text-black">No Available Routes</div>}
                </div>
                <div className="mt-auto p-2">
                    {!collapsed && (
                        <div className="mt-3 space-y-1">
                            <div className="text-center">
                                <div className="font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                            <Link
                                href={route('profile.edit')}
                                className="block p-3 text-gray-700 hover:bg-gray-200"
                            >
                                Profile
                            </Link>
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="block p-3 text-gray-700 hover:bg-gray-200"
                            >
                                Log Out
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1">
                {header && (
                    <header className="bg-white shadow">
                        <div className="flex mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                {collapsed ? '☰' : '×'}
                            </button>
                            {header}
                        </div>
                    </header>
                )}
                <main>{children}</main>
            </div>
        </div>
    );
}
