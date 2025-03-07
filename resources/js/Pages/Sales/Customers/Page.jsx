import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const CustomersIndex = ({ Customers }) => {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Customers
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-4 flex justify-between">
                                <h1 className="text-lg font-semibold">
                                    Customer List
                                </h1>
                                <Link
                                    href="/customers/create"
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    Create New Customer
                                </Link>
                            </div>

                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">
                                            #
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Customer ID
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Name
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Receiver's Name
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Customers?.map((pm, index) => (
                                        <tr key={pm.id}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {pm.id}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {pm.first_name + pm.last_name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {pm.receiver_name
                                                    ? pm.receiver_name
                                                    : 'No Receiver Name'
                                                }
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <Link
                                                    href={`/customers/${pm.id}/edit`}
                                                    className="mr-2 text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/customers/${pm.id}`}
                                                    method="delete"
                                                    className="text-red-500 hover:underline"
                                                    as="button"
                                                    onClick={(e) => {
                                                        e.preventDefault(); // Prevent default link behavior
                                                        if (
                                                            confirm(
                                                                'Are you sure you want to remove this Customer?',
                                                            )
                                                        ) {
                                                            // Perform the deletion
                                                            router.delete(
                                                                `/customers/${pm.id}`,
                                                            );
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CustomersIndex;
