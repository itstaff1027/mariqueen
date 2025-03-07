import React, { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const WarehouseProductVariantList = ({ warehouse, products, colors, sizes, size_values, heel_heights, categories }) => {
    const [search, setSearch] = useState("");
    const [color, setColors] = useState("");
    const [size, setSizes] = useState("");
    const [sizeValue, setSizeValues] = useState("");
    const [heelHeight, setHeelHeights] = useState("");
    const [category, setCategory] = useState("");
    const [qtyFilter, setQtyFilter] = useState("all"); // New state for quantity filter

    const filteredProducts = products.filter(stock => {
        // Compute overall quantity
        const overallQty = stock.total_stock;

        // Check quantity filter
        let qtyMatches = true;
        if (qtyFilter === "positive") {
            qtyMatches = overallQty > 0;
        } else if (qtyFilter === "zero") {
            qtyMatches = overallQty === 0;
        } else if (qtyFilter === "negative") {
            qtyMatches = overallQty < 0;
        }

        // Other filters
        const matchesFilters = (
            (!category || stock.product_variant.category_id === parseInt(category)) &&
            (!size || stock.product_variant.size_id === parseInt(size)) &&
            (!sizeValue || stock.product_variant.size_value_id === parseInt(sizeValue)) &&
            (!heelHeight || stock.product_variant.heel_height_id === parseInt(heelHeight)) &&
            (!color || stock.product_variant.color_id === parseInt(color))
        );

        const matchesSearch = search === "" ||
            stock.product_variant.sku.toLowerCase().includes(search.toLowerCase()) ||
            stock.product_variant.colors.color_name.toLowerCase().includes(search.toLowerCase()) ||
            stock.product_variant.categories.category_name.toLowerCase().includes(search.toLowerCase());

        return matchesFilters && matchesSearch && qtyMatches;
    });

    useEffect(() => {
        console.log(products);
        console.log(warehouse)
    }, [products]);

    // Existing export to Excel function remains unchanged (if needed)
    const handleExportExcel = () => {
        const exportData = filteredProducts.map((product) => ({
            SKU: product.product_variant.sku,
            Design: product.product_variant.product.product_name,
            Color: product.product_variant.colors.color_name,
            Size: product.product_variant.sizes.size_name,
            SizeValues: product.product_variant.size_values.size_values,
            HeelHeight: product.product_variant.heel_heights.value,
            Category: product.product_variant.categories.category_name,
            OverallQty: product.total_stock,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, `${warehouse.name} Products`);
        XLSX.writeFile(workbook, `${warehouse.name}_product_list_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Warehouse - {warehouse.name}
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-md">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <h1 className="text-2xl font-bold">
                                        Available Products
                                    </h1>
                                    <div className="flex gap-2">
                                        <Link
                                            href="/inventory/stock/transactions"
                                            className="rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
                                        >
                                            Stock Transactions
                                        </Link>
                                        <button
                                            onClick={handleExportExcel}
                                            className="rounded bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600"
                                        >
                                            Export to Excel
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                                    <select
                                        value={category || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
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
                                        onChange={(e) =>
                                            setSizes(e.target.value)
                                        }
                                    >
                                        <option value="">All Sizes</option>
                                        {sizes.map((size) => (
                                            <option
                                                key={size.id}
                                                value={size.id}
                                            >
                                                {size.size_name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={sizeValue || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) =>
                                            setSizeValues(e.target.value)
                                        }
                                    >
                                        <option value="">Size Values</option>
                                        {size_values.map((size_value) => (
                                            <option
                                                key={size_value.id}
                                                value={size_value.id}
                                            >
                                                {size_value.size_values}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={heelHeight || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) =>
                                            setHeelHeights(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            All Heel Heights
                                        </option>
                                        {heel_heights.map((height) => (
                                            <option
                                                key={height.id}
                                                value={height.id}
                                            >
                                                {height.value}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={color || ''}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) =>
                                            setColors(e.target.value)
                                        }
                                    >
                                        <option value="">All Colors</option>
                                        {colors.map((color) => (
                                            <option
                                                key={color.id}
                                                value={color.id}
                                            >
                                                {color.color_name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* New Quantity Filter Dropdown */}
                                    <select
                                        value={qtyFilter}
                                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                                        onChange={(e) =>
                                            setQtyFilter(e.target.value)
                                        }
                                    >
                                        <option value="all">
                                            All Quantities
                                        </option>
                                        <option value="negative">
                                            Negative Quantities
                                        </option>
                                        <option value="zero">
                                            Zero Quantities
                                        </option>
                                        <option value="positive">
                                            Positive Quantities
                                        </option>
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Search for a product.product_variant..."
                                    className="w-full rounded-md border p-2"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <table className="mt-4 w-full table-auto border-collapse border border-gray-300 text-center">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2">
                                                Product SKU
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Overall Qty
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Heel Height
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Size
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Size Values
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Category
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map((product) => (
                                            <tr
                                                key={product.product_variant.id}
                                            >
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        product.product_variant
                                                            .sku
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {product.total_stock}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        product.product_variant
                                                            .heel_heights.value
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        product.product_variant
                                                            .sizes.size_name
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        product.product_variant
                                                            .size_values
                                                            .size_values
                                                    }
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {
                                                        product.product_variant
                                                            .categories
                                                            .category_name
                                                    }
                                                </td>
                                                <td className="space-x-2 border border-gray-300 px-6 py-3">
                                                    <Link
                                                        href={`/inventory/product/variant/${product.product_variant.id}`}
                                                        className="text-orange-500 hover:underline"
                                                    >
                                                        View
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
            </div>
        </AuthenticatedLayout>
    );
};

export default WarehouseProductVariantList;
