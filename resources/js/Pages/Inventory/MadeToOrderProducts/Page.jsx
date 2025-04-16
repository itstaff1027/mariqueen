import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const MadeToOrderProductsIndex = ({ made_to_order_products }) => {
    
    const [search, setSearch] = useState("");

    const handleFilter = () => {
        router.visit('/made_to_orders', {
            method: 'get',
            data: { search },
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        console.log(made_to_order_products.data);
    }, [])
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    MTO Products
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 bg-white p-6">
                            <div className="mb-4 flex justify-between">
                                <h1 className="text-lg font-semibold">
                                    MTO Product List
                                </h1>
                            </div>
                            <button
                                onClick={handleFilter}
                                className="rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
                            >
                                Filter
                            </button>
                            <input
                                type="text"
                                placeholder="Search for Order Number, Customer Name, Tracking #"
                                className="mb-2 w-full rounded-md border p-2"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">
                                            #
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            MTO-Order-#
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Product Details
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Cost
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {made_to_order_products.data?.map(
                                        (mtop, index) => (
                                            <tr key={mtop.id}>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {mtop.id}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        mtop.mto_items.mto_order
                                                            .mto_order_number
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {mtop.product_name} -{' '}
                                                    {mtop.color} -
                                                    {mtop.size &&
                                                        ` Size: ${mtop.size} -`}
                                                    {mtop.heel_height &&
                                                        ` Heel Height ${mtop.heel_height} Inches -`}
                                                    {mtop.type_of_heel &&
                                                        ` Type: ${mtop.type_of_heel} - `}
                                                    {mtop.round &&
                                                        ` Round: ${mtop.round} - `}
                                                    {mtop.length &&
                                                        ` Length: ${mtop.length} - `}
                                                    {mtop.back_strap &&
                                                        ` Back Strap: ${mtop.back_strap}`}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        mtop.cost
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <Link
                                                        href={`/inventory_mto_products/${mtop.id}/edit`}
                                                        className="mr-2 text-blue-500 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                             {made_to_order_products.links && (
                                <div className="mt-4 flex justify-center">
                                    {made_to_order_products.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (link.url) {
                                                        router.visit(link.url, {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                            className={`mx-1 px-3 py-1 border rounded ${
                                            link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        ></button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MadeToOrderProductsIndex;
