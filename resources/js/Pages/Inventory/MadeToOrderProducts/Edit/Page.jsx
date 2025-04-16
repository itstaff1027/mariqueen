import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { Textarea } from '@headlessui/react';

const EditMTOProducts = ({ made_to_order_product, products, colors, sizes, heel_heights }) => {
    const { data, setData, put, errors } = useForm({
        made_to_order_product_id: made_to_order_product.id || '',
        product_name: made_to_order_product.product_name || '',
        color_name: made_to_order_product.color || '',
        size_value: made_to_order_product.size || '',
        heel_height: made_to_order_product.heel_height || '',
        type_of_heel: made_to_order_product.type_of_heel || '',
        round: made_to_order_product.round || '',
        length: made_to_order_product.length || '',
        back_strap: made_to_order_product.back_strap || '',
        cost: made_to_order_product.cost || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/inventory_mto_products/${made_to_order_product.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit MTO Product
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-xl font-semibold mb-6">Edit MTO Product</h1>
                            <div>
                                {/* Name Input Field */}
                                <div className="mb-6">
                                    <InputLabel for="product_name" value="Product Name" />
                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={data.product_name}
                                        onChange={(e) => setData('product_name', e.target.value)}
                                    >
                                        <option value="">Select Product Name</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.product_name}>
                                                {product.product_name}
                                            </option>
                                        ))}
                                        <option value="others">Others</option>
                                    </select>
                                    <InputError message={errors.product_name} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="color_name" value="Product Name" />
                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={data.color_name}
                                        onChange={(e) => setData('color_name', e.target.value)}
                                    >
                                        <option value="">Select Color</option>
                                        {colors.map(color => (
                                            <option key={color.id} value={color.color_name}>
                                                {color.color_name}
                                            </option>
                                        ))}
                                        <option value="others">Others</option>
                                    </select>
                                    <InputError message={errors.color_name} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="size_value" value="Product Descprition" />
                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={data.size_value}
                                        onChange={(e) => setData('size_value', e.target.value)}
                                    >
                                        <option value="">Select Size</option>
                                        {sizes.map(size_value => (
                                            <option key={size_value.id} value={size_value.size_values}>
                                                {size_value.size_values} - {size_value.size.size_name}
                                            </option>
                                        ))}
                                        <option value="others">Others</option>
                                    </select>
                                    <InputError message={errors.size_value} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="heel_height" value="Heel Height" />
                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={data.heel_height}
                                        onChange={(e) => setData('heel_height', e.target.value)}
                                    >
                                        <option value="">Select Heel Height</option>
                                        {heel_heights.map(heel => (
                                            <option key={heel.id} value={heel.value}>
                                                {heel.value} Inches
                                            </option>
                                        ))}
                                        <option value="others">Others</option>
                                    </select>
                                    <InputError message={errors.heel_height} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="type_of_heel" value="Product Descprition" />
                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={data.type_of_heel}
                                        onChange={(e) => setData('type_of_heel', e.target.value)}
                                    >
                                        <option value="">Select Type of Heels</option>
                                        <option value="b-thick_heel">B-Thick Heel</option>
                                        <option value="pin_heel">Pin Heel</option>
                                        <option value="block_heel">Block Heel</option>
                                        <option value="others">Others</option>
                                    </select>
                                    <InputError message={errors.type_of_heel} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="round" value="Round" />
                                    <TextInput
                                        type="text"
                                        id="round" 
                                        name="round" 
                                        value={data.round} 
                                        onChange={(e) => setData('round', e.target.value)}
                                        className="w-full" 
                                    />
                                    <InputError message={errors.round} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="length" value="Length" />
                                    <TextInput
                                        type="text"
                                        id="length" 
                                        name="length" 
                                        value={data.length} 
                                        onChange={(e) => setData('length', e.target.value)}
                                        className="w-full" 
                                    />
                                    <InputError message={errors.length} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="back_strap" value="Back Strap" />
                                    <TextInput
                                        type="text"
                                        id="back_strap" 
                                        name="back_strap" 
                                        value={data.back_strap} 
                                        onChange={(e) => setData('back_strap', e.target.value)}
                                        className="w-full" 
                                    />
                                    <InputError message={errors.back_strap} />
                                </div>

                                <div className="mb-6">
                                    <InputLabel for="cost" value="Cost" />
                                    <TextInput
                                        type="text"
                                        id="cost" 
                                        name="cost" 
                                        value={data.cost} 
                                        onChange={(e) => setData('cost', e.target.value)}
                                        className="w-full" 
                                    />
                                    <InputError message={errors.cost} />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={handleSubmit}
                                >
                                    Edit MTO Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditMTOProducts;
