import React, {useEffect, useState} from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ProductList = ({ products, colors, sizes, heel_heights, categories }) => {
    const { auth } = usePage().props;
    const user = auth.user;
    const destroy = (e, id) => {
        e.preventDefault();

        if (confirm('Are you sure?')){
            router.delete(`/inventory/products/${id}`);
        }
    };

    const [search, setSearch] = useState("");
    const [color, setColors] = useState("");
    const [size, setSizes] = useState("");
    const [sizeValue, setSizeValues] = useState("");
    const [heelHeight, setHeelHeights] = useState("");
    const [category, setCategory] = useState("");

    const handleFilter = () => {
        // Trigger a new request with the filter parameters
        router.visit('/inventory/products', {
            method: 'get',
            data: {
                category,
                size,
                size_value: sizeValue,
                heel_height: heelHeight,
                color,
                search,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        console.log(products.data[0]);
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
                                    <h1 className="text-2xl font-bold">Products</h1>
                                    <Link
                                        href="/inventory/products/create"
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Add Product
                                    </Link>
                                </div>
                                <div className="col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                    <select
                                        value={category || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.category_name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={size || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) => setSizes(e.target.value)}
                                    >
                                        <option value="">All Sizes</option>
                                        {sizes.map((size) => (
                                            <option key={size.id} value={size.id}>
                                                {size.size_name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={heelHeight || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) => setHeelHeights(e.target.value)}
                                    >
                                        <option value="">All Heel Heights</option>
                                        {heel_heights.map((height) => (
                                            <option key={height.id} value={height.id}>
                                                {height.value}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={color || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) => setColors(e.target.value)}
                                    >
                                        <option value="">All Colors</option>
                                        {colors.map((color) => (
                                            <option key={color.id} value={color.id}>
                                                {color.color_name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleFilter}
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Filter
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Search for a product..."
                                    className="w-full rounded-md border p-2 mb-2"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2">Name</th>
                                        <th className="border border-gray-300 px-4 py-2">SRP</th>
                                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data?.map((product) => (
                                            <tr key={product.id}>
                                                <td className="border border-gray-300 px-4 py-2">{product.product_name}</td>
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
                                                    {
                                                        user.roles?.some(r => r.name === 'admin') && product.variants.length > 0 ? <></> : <button
                                                            type="button"
                                                            onClick={(e) => destroy(e, product.id)}
                                                            className="text-red-600 hover:text-red-700 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    }
                                                    
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Pagination */}
                                {products.links && (
                                    <div className="mt-4 flex justify-center">
                                        {products.links.map((link, index) => (
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
            </div>
        </AuthenticatedLayout>
    )
};

export default ProductList;
