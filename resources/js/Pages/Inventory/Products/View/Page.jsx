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

    console.log(variants);
    console.log(data);

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
    console.log(product);
    console.log(size_values);
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
                                    <div className="mb-4">
                                        <InputLabel for="name" value="Product Name" />
                                        <TextInput
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.product_name}
                                            onChange={(e) => setData('product_name', e.target.value)}
                                            className="w-full border px-4 py-2"
                                            disabled
                                        />
                                        <InputError message={errors.product_name} />
                                    </div>
                                    <div className="mb-4">
                                        <InputLabel for="status" value="Status" />
                                        <TextInput
                                            type="text"
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full border px-4 py-2"
                                            disabled
                                        />
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="mb-4">
                                        <InputLabel for="cost" value="Cost" />
                                        <TextInput
                                            type="number"
                                            id="cost"
                                            name="cost"
                                            value={data.cost}
                                            onChange={(e) => setData('cost', e.target.value)}
                                            className="w-full border px-4 py-2"
                                            disabled
                                        />
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="mb-4">
                                        <InputLabel for="srp" value="SRP" />
                                        <TextInput
                                            type="number"
                                            id="srp"
                                            name="srp"
                                            value={data.srp}
                                            onChange={(e) => setData('srp', e.target.value)}
                                            className="w-full border px-4 py-2"
                                            disabled
                                        />
                                        <InputError message={errors.srp} />
                                    </div>
                                    <div className="mb-4">
                                        <InputLabel for="colors" value="Colors" />
                                        <Colors.Selection
                                            handleSelectedColor={(selectedColor, isRemoving = false) => {
                                                if (isRemoving) {
                                                    // Remove the color by ID
                                                    setData('colors', data.colors.filter(color => color.id !== selectedColor.id)); // Remove the color by ID
                                                } else {
                                                    // Check if the color is already in the list before adding it
                                                    if (!data.colors.some(color => color.id === selectedColor.id)) {
                                                    // Add the selected color
                                                    setData('colors', [...data.colors, selectedColor]);
                                                    }
                                                }
                                            }} 
                                            colors={data.colors} 
                                            availableColors={colors}
                                        />
                                        <InputError message={errors.colors} />
                                    </div>

                                    <div className="mb-4">
                                        <InputLabel for="sizes" value="Sizes" />
                                        <Sizes.Selection
                                            handleSelectedSizes={(selectedSize, isRemoving = false) => {
                                                if (isRemoving) {
                                                    // Remove the color by ID
                                                    setData('sizes', data.sizes.filter(size => size.id !== selectedSize.id)); // Remove the Size by ID
                                                } else {
                                                    // Check if the Size is already in the list before adding it
                                                    if (!data.sizes.some(size => size.id === selectedSize.id)) {
                                                    // Add the selected Size
                                                    setData('sizes', [...data.sizes, selectedSize]);
                                                    }
                                                }
                                            }} 
                                            sizes={data.sizes} 
                                            availableSizes={sizes}
                                        />
                                        <InputError message={errors.sizes} />
                                    </div>

                                    <div className="mb-4">
                                        <InputLabel for="heel_height" value="Heel Heights" />
                                        <HeelHeights.Selection
                                            handleSelectedHeelHeights={(selectedHeelHeight, isRemoving = false) => {
                                                if (isRemoving) {
                                                    // Remove the color by ID
                                                    setData('heel_heights', data.heel_heights.filter(HeelHeight => HeelHeight.id !== selectedHeelHeight.id)); // Remove the HeelHeight by ID
                                                } else {
                                                    // Check if the HeelHeight is already in the list before adding it
                                                    if (!data.heel_heights.some(HeelHeight => HeelHeight.id === selectedHeelHeight.id)) {
                                                    // Add the selected HeelHeight
                                                    setData('heel_heights', [...data.heel_heights, selectedHeelHeight]);
                                                    }
                                                }
                                            }} 
                                            heelHeights={data.heel_heights} 
                                            availableHeelHeights={heel_heights}
                                        />
                                        <InputError message={errors.HeelHeights} />
                                    </div>

                                    <div className="mb-4">
                                        <InputLabel for="categories" value="Category" />
                                        <Categories.Selection
                                            handleSelectedCategories={(selectedCategories, isRemoving = false) => {
                                                if (isRemoving) {
                                                    // Remove the color by ID
                                                    setData('categories', data.categories.filter(categories => categories.id !== selectedCategories.id)); // Remove the categories by ID
                                                } else {
                                                    // Check if the categories is already in the list before adding it
                                                    if (!data.categories.some(categories => categories.id === selectedCategories.id)) {
                                                    // Add the selected HeelHeight
                                                    setData('categories', [...data.categories, selectedCategories]);
                                                    }
                                                }
                                            }} 
                                            categories={data.categories} 
                                            availableCategories={categories}
                                        />
                                        <InputError message={errors.categories} />
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
