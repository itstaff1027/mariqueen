import React from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ProductList = ({ products }) => {

    const destroy = (e, id) => {
        e.preventDefault();

        if (confirm('Are you sure?')){
            router.delete(`/inventory/products/${id}`);
        }
    };
    
    return(
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products Management
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Products</h1>
                                    <Link
                                        href="/inventory/products/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Add Product
                                    </Link>
                                </div>
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        {/* <th className="border border-gray-300 px-4 py-2">Status</th> */}
                                        {/* <th className="border border-gray-300 px-4 py-2">Cost</th> */}
                                        <th className="border border-gray-300 px-4 py-2">SRP</th>
                                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
                                            {/* <td className="border border-gray-300 px-4 py-2">{product.status}</td> */}
                                            {/* <td className="border border-gray-300 px-4 py-2">{product.cost}</td> */}
                                            <td className="border border-gray-300 px-4 py-2">{product.srp}</td>
                                            <td className="border border-gray-300 px-6 py-3 space-x-2">
                                                <Link
                                                    href={`/inventory/products/${product.id}`}
                                                    className="text-orange-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/inventory/products/${product.id}/edit`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={(e) => destroy(e, product.id)}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
};

export default ProductList;
