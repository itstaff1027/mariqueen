import React, {useEffect} from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ProductVariantList = ({ products }) => {

    // const destroy = (e, id) => {
    //     e.preventDefault();

    //     if (confirm('Are you sure?')){
    //         router.delete(`/inventory/products/${id}`);
    //     }
    // };
    
    useEffect(() => {
        console.log(products)
    }, [])

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
                                    <h1 className="text-2xl font-bold">Product Variants</h1>
                                    <Link
                                        href="/inventory/stocks/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Add Stocks
                                    </Link>
                                    <Link
                                        href="/inventory/stock/transfer"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Transfer Stocks
                                    </Link>
                                </div>
                                <table className="w-full table-auto border-collapse border text-center border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2">Product SKU</th>
                                            <th className="border border-gray-300 px-4 py-2">Overall Qty</th>
                                            <th className="border border-gray-300 px-4 py-2">Heel Height</th>
                                            <th className="border border-gray-300 px-4 py-2">Size</th>
                                            <th className="border border-gray-300 px-4 py-2">Size Values</th>
                                            <th className="border border-gray-300 px-4 py-2">Category</th>
                                            <th className="border border-gray-300 px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="border border-gray-300 px-4 py-2">{product.sku}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.total_purchased - product.total_sold}</td>
                                            <td className="border border-gray-300 px-4 py-2">{product.heel_heights.value}</td>
                                            <th className="border border-gray-300 px-4 py-2">{product.sizes.size_name}</th>
                                            <th className="border border-gray-300 px-4 py-2">{product.size_values.size_values}</th>
                                            <td className="border border-gray-300 px-4 py-2">{product.categories.category_name}</td>
                                            <td className="border border-gray-300 px-6 py-3 space-x-2">
                                                <Link
                                                    href={`/inventory/product/variant/${product.id}`}
                                                    className="text-orange-500 hover:underline"
                                                >
                                                    View
                                                </Link>
                                                {/* <Link
                                                    href={`/inventory/products/${product.id}/edit`}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </Link> */}
                                                {/* <button
                                                    type="button"
                                                    onClick={(e) => destroy(e, product.id)}
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button> */}
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

export default ProductVariantList;
