import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SubNavigaiton from '@/Components/UI/Navigation/SubNavigation';

export default function AnalyticsLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const allowedRoutes = user.allowed_routes || [];
    const paths = [
        {
            'id': '0',
            'name': 'Finance',
            'route': 'settings'
        },
        {
            'id': '1',
            'name': 'Sales',
            'route': 'sales_analytics_dashboard'
        },
        {
            'id': '2',
            'name': 'Logistics',
            'route': 'settings_sizes.index'
        },
        {
            'id': '3',
            'name': 'Inventory',
            'route': 'settings_heel-heights.index'
        },
        // {
        //     'id': '5',
        //     'name': 'Order Types',
        //     'route': 'create-order-types'
        // },
        // {
        //     'id': '6',
        //     'name': 'Page Sections',
        //     'route': 'page_sections'
        // }
        
    ];

    const allowedRouteNames = allowedRoutes.map((routeObj) => routeObj.route_name);

    // Then filter your paths:
    const filteredPaths = allowedRouteNames.length > 0 
        ? paths.filter((path) => allowedRouteNames.includes(path.route))
        : paths;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Analytics
                </h2>
            }
        >
            <Head title="Settings" />

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
