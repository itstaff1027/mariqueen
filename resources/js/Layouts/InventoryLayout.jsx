import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SubNavigaiton from '@/Components/UI/Navigation/SubNavigation';

export default function InventoryLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const allowedRoutes = user.allowed_routes || [];
    const paths = [
        {
            id: '0',
            name: 'Inventory',
            route: 'inventory',
        },
        {
            id: '1',
            name: 'Products',
            route: 'products.index',
        },
        {
            id: '2',
            name: 'Stocks',
            route: 'stocks.index',
        },
        {
            id: '2',
            name: 'Stock Transactions',
            route: 'transactions.index',
        },
        {
            id: '3',
            name: 'Warehouse',
            route: 'warehouses.index',
        },
        {
            id: '4',
            name: 'Sales Orders',
            route: 'inventory_orders.index',
        },
        {
            id: '5',
            name: 'Packaging Types',
            route: 'inventory_packaging_types.index',
        },
        {
            id: '6',
            name: 'Made To Order Products',
            route: 'inventory_mto_products.index',
        },
        {
            id: '7',
            name: 'Made To Orders',
            route: 'inventory_mto_orders.index',
        },
        {
            id: '8',
            name: 'Batches',
            route: 'batches.index',
        },
    ];

    const allowedRouteNames = allowedRoutes.map((routeObj) => routeObj.route_name);

    // Then filter your paths:
    const filteredPaths = allowedRouteNames.length > 0
        ? paths.filter((path) => allowedRouteNames.includes(path.route))
        : paths;

    return (
        <AuthenticatedLayout
            header={
                <div className="w-full text-xl font-semibold leading-tight text-gray-800">
                    {header || ''}
                </div>
            }
        >
            <Head title="Inventory" />

            <SubNavigaiton data={paths} container_styles={''} route_styles={''} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* {header && (
                                <header className="bg-white shadow">
                                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                        {header}
                                    </div>
                                </header>
                            )} */}

                            <main>{children}</main>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
