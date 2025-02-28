import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Colors from '@/Components/Colors';
import Sizes from '@/Components/Sizes';
import HeelHeights from '@/Components/HeelHeights';
import Categories from '@/Components/Categories';

const ViewProduct = ({ product, product_variants, colors, sizes, size_values, heel_heights, categories }) => {
  const { data, setData, post, errors } = useForm({
    product_name: product.product_name || '',
    status: product.status || '',
    cost: product.cost || 0,
    srp: product.srp || 0,
    colors: product.colors || [],
    sizes: product.sizes || [],
    heel_heights: product.heel_heights || [],
    categories: product.categories || [],
    product_variants: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // const payload = {
    //     product_id: product.id,
    //     variants, // Includes all the updated variants with SKUs
    // };

    // console.log(variants);
    // console.log(data);

    post('/inventory/products/variants');
};

  const [variants, setVariants] = useState([]);

    const generateVariants = () => {
        const generatedVariants = [];

        product.colors.forEach(color => {
            product.heel_heights.forEach(heelHeight => {
                product.sizes.forEach(size => {
                    size.size_values.forEach(sizeValue => {
                        const isExisting = product_variants.some(variant =>
                            variant.color_id === color.id &&
                            variant.heel_height_id === heelHeight.id &&
                            variant.size_id === size.id &&
                            variant.size_value_id === sizeValue.id
                        );

                        if (!isExisting) {
                            generatedVariants.push({
                                product_id: product.id,
                                color_id: color.id,
                                heel_height_id: heelHeight.id,
                                size_id: size.id,
                                size_value_id: sizeValue.id,
                                category_id: product.categories[0].id,
                                sku: '', // Initialize SKU
                                unit_price: 0,
                                cost: 0
                            });
                        }
                    });
                });
            });
        });


    setVariants([...variants, ...generatedVariants]);
    setData('product_variants', [...variants, ...generatedVariants])

    // console.log(size_values)
};


  useEffect(() => {
    // console.log(product);
    // console.log(size_values);
  }, []);

  return (
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
                                <h1 className="text-2xl font-bold mb-4">View Product</h1>
                                <div>
                                    <div className="w-full p-6 bg-white shadow-md rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Product Name & Status */}
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">Product Name</h2>
                                                <p className="text-xl font-bold text-gray-900">{data.product_name}</p>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">Status</h2>
                                                <p className={`text-lg font-semibold ${data.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{data.status}</p>
                                            </div>

                                            <hr className="col-span-2" />

                                            {/* Cost & SRP */}
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">Cost</h2>
                                                <p className="text-lg font-bold text-gray-900">₱{data.cost}</p>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">SRP</h2>
                                                <p className="text-lg font-bold text-gray-900">₱{data.srp}</p>
                                            </div>

                                            <hr className="col-span-2" />

                                            {/* Colors & Sizes */}
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">Colors</h2>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {data.colors.map((color) => (
                                                        <span key={color.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">{color.color_name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">Sizes</h2>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {data.sizes.map((size) => (
                                                        <span key={size.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">{size.size_name}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <hr className="col-span-2" />

                                            {/* Heel Heights & Categories */}
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">Heel Heights</h2>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {data.heel_heights.map((heel) => (
                                                        <span key={heel.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">{heel.value}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-700">Category</h2>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {data.categories.map((category) => (
                                                        <span key={category.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">{category.category_name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Repeat similar fields for HeelHeights, Heel Heights, Categories */}
                                    <button
                                        type="submit"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        onClick={(e) => generateVariants(e)}
                                    >
                                        Generate Variants
                                    </button>
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Product Variants</h2>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm text-left text-gray-500 bg-gray-50 border border-gray-200 rounded-lg shadow">
                                                <thead className="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Color</th>
                                                        <th className="px-4 py-3 font-medium">Heel Height</th>
                                                        <th className="px-4 py-3 font-medium">Size Value</th>
                                                        <th className="px-4 py-3 font-medium">SKU</th>
                                                        <th className="px-4 py-3 font-medium">SRP</th>
                                                        <th className="px-4 py-3 font-medium">COST</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {variants.map((variant, index) => {
                                                        const colorName = colors.find(color => color.id === variant.color_id)?.color_name || 'Unknown';
                                                        const heelHeightName = heel_heights.find(height => height.id === variant.heel_height_id)?.value || 'Unknown';
                                                        const sizeValue = size_values.find(value => value.id === variant.size_value_id)?.size_values || 'Unknown';    
                                                        return (
                                                            <tr key={index} className="hover:bg-gray-50 transition">
                                                                <td className="px-4 py-2 text-gray-900">{colorName}</td>
                                                                <td className="px-4 py-2 text-gray-900">{heelHeightName}</td>
                                                                <td className="px-4 py-2 text-gray-900">{sizeValue}</td>
                                                                <td className="px-4 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={variant.sku}
                                                                        onChange={(e) => {
                                                                            const updatedVariants = [...variants];
                                                                            updatedVariants[index].sku = e.target.value;
                                                                            setVariants(updatedVariants);
                                                                        }}
                                                                        placeholder="Enter SKU"
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-green-300 focus:outline-none transition"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={variant.unit_price}
                                                                        onChange={(e) => {
                                                                            const updatedVariants = [...variants];
                                                                            updatedVariants[index].unit_price = e.target.value;
                                                                            setVariants(updatedVariants);
                                                                        }}
                                                                        placeholder="Enter Unit Price"
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-green-300 focus:outline-none transition"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={variant.cost}
                                                                        onChange={(e) => {
                                                                            const updatedVariants = [...variants];
                                                                            updatedVariants[index].cost = e.target.value;
                                                                            setVariants(updatedVariants);
                                                                        }}
                                                                        placeholder="Enter Unit Cost"
                                                                        className="w-full border border-gray-300 rounded-md px-3 py-1 focus:ring focus:ring-green-300 focus:outline-none transition"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        {
                                            variants.length > 0 && <div className="flex justify-end mt-6">
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleSubmit(e)}
                                                    className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                                                >
                                                    Save Variants
                                                </button>
                                            </div>
                                        }

                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Existing Product Variants</h2>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm text-left text-gray-500 bg-gray-50 border border-gray-200 rounded-lg shadow">
                                                <thead className="bg-gray-100 text-gray-700">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium">Color</th>
                                                        <th className="px-4 py-3 font-medium">Heel Height</th>
                                                        <th className="px-4 py-3 font-medium">Size Value</th>
                                                        <th className="px-4 py-3 font-medium">SKU</th>
                                                        <th className="px-4 py-3 font-medium">SRP</th>
                                                        <th className="px-4 py-3 font-medium">COST</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {product_variants?.map((variant, index) => {
                                                        const colorName = colors.find(color => color.id === variant.color_id)?.color_name || 'Unknown';
                                                        const heelHeightName = heel_heights.find(height => height.id === variant.heel_height_id)?.value || 'Unknown';
                                                        const size_value = size_values.find(values => values.id === variant.size_value_id)?.size_values || 'Unknown';
                                                        return (
                                                            <tr key={index} className="hover:bg-gray-50 transition">
                                                                <td className="px-4 py-2 text-gray-900">{colorName}</td>
                                                                <td className="px-4 py-2 text-gray-900">{heelHeightName}</td>
                                                                <td className="px-4 py-2 text-gray-900">{size_value}</td>
                                                                <td className="px-4 py-2 text-gray-900">{variant.sku}</td>
                                                                <td className="px-4 py-2 text-gray-900">{variant.unit_price}</td>
                                                                <td className="px-4 py-2 text-gray-900">{variant.cost}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    
  );
};

export default ViewProduct;
