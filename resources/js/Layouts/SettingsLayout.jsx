import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function SettingsLayout({ header, children }) {
    
    const paths = [
        {
            'id': '0',
            'name': 'Settings',
            'route': 'settings'
        },
        {
            'id': '1',
            'name': 'Colors',
            'route': 'settings_colors.index'
        },
        {
            'id': '2',
            'name': 'Sizes',
            'route': 'settings_sizes.index'
        },
        {
            'id': '3',
            'name': 'Heel Heights',
            'route': 'settings_heel-heights.index'
        },
        {
            'id': '4',
            'name': 'Categories',
            'route': 'settings_categories.index'
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start p-4">
                                {paths.map((path, i) => (
                                    <ResponsiveNavLink 
                                        href={route(`${path.route}`)}
                                        active={route().current(`${path.route}`)}
                                        key={i}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
                                    >
                                        {path.name}
                                    </ResponsiveNavLink>
                                ))}
                            </div>
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
