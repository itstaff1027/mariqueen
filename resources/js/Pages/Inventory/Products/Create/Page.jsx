import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Colors from '@/Components/Colors';
import Sizes from '@/Components/Sizes';
import HeelHeights from '@/Components/HeelHeights';
import Categories from '@/Components/Categories';

const CreateProduct = ({ colors, sizes, heel_heights, categories }) => {
  const { data, setData, post, errors, reset } = useForm({
    product_name: '',
    status: 'inactive',
    cost: 0,
    srp: 0,
    colors: [],
    sizes: [],
    heel_heights: [],
    categories: [],
  });

  const handleSubmit = (e) => {
    console.log(data);
    e.preventDefault();
    post('/inventory/products');
  };

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
                                <h1 className="text-2xl font-bold mb-4">Add Product</h1>
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
                                        />
                                        <InputError message={errors.product_name} />
                                    </div>
                                    <div className="mb-4">
                                        {/* <InputLabel for="status" value="Status" /> */}
                                        <TextInput
                                            type="text"
                                            id="status"
                                            name="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full border px-4 py-2"
                                            hidden
                                        />
                                        <InputError message={errors.status} />
                                    </div>
                                    <div className="mb-4">
                                        {/* <InputLabel for="cost" value="Cost" hidden /> */}
                                        <TextInput
                                            type="number"
                                            id="cost"
                                            name="cost"
                                            value={data.cost}
                                            onChange={(e) => setData('cost', e.target.value)}
                                            className="w-full border px-4 py-2"
                                            hidden
                                        />
                                        <InputError message={errors.cost} />
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
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    
  );
};

export default CreateProduct;
