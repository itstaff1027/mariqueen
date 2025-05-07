import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const PromotionsIndex = ({ promotions }) => {

    const { flash } = usePage().props;

    // const [promotions, setPromotions] = useState(promotions);

    useEffect(() => {
        console.log(promotions)
        // console.log(tests);
    }, [])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Promotions
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-4 flex justify-between">
                                <h1 className="text-lg font-semibold">
                                    Promotion List
                                </h1>
                                <Link
                                    href="/promotions/create"
                                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                >
                                    New Promotion
                                </Link>
                            </div>

                            {flash.success && (
                                <div className="my-4 w-full rounded-xl border border-emerald-500 bg-emerald-100 p-4">
                                    <p className="text-sm text-emerald-600">
                                        {flash.success}
                                    </p>
                                </div>
                            )}

                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">
                                            #
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Name
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Type
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Value
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Starts At
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Ends At
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {promotions?.map(({ data }, i) => (
                                        <tr for={i}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {data.id}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {data.name}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {data.type}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {data.discount_value}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {data.starts_at}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {data.ends_at}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <Link
                                                    href={route(
                                                        'promotion_conditions.show',
                                                        data.id,
                                                    )}
                                                    className="mr-2 text-yellow-500 hover:underline"
                                                >
                                                    Assign Items
                                                </Link>
                                                
                                                <Link
                                                    href={`/promotions/${data.id}/edit`}
                                                    className="mr-2 text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                {/* <Link
                                                        href={`/promotions/${data.id}`}
                                                        method="delete"
                                                        className="text-red-500 hover:underline"
                                                        as="button"
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent default link behavior
                                                            if (confirm("Are you sure you want to remove this Promotion?")) {
                                                                // Perform the deletion
                                                                router.delete(`/promotions/${data.id}`);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </Link> */}
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

export default PromotionsIndex;
