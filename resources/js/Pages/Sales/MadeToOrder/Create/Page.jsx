import React, { useState, useEffect } from 'react';
import { usePage, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import { Textarea } from '@headlessui/react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';

const MTOPOS = ({ 
    products,
    colors, 
    heel_heights, 
    size_values, 
    couriers, 
    payment_methods,
    customers,
    packaging_types
}) => {
    const { data, setData, post, errors } = useForm({
        cart: [],
        product_name: '',
        color_name: '',
        size_values: '',
        heel_heights: '',
        type_of_heels: '',
        round: '',
        length: '',
        back_strap: '',
        cost: '',
        courier_id: '',
        payment_method_id: '',
        shipping_cost: 0,
        rush_order_fee: '',
        payment_amount: 0,
        total_amount: 0,
        grand_total: 0,
        remarks: '',
        customer_id: 0,
        packaging_type_id: '',
        shoulder_by: 'bragais',
        images: []
    });

    const [customerSearch, setCustomerSearch] = useState("");
    const [customerDropdownVisible, setCustomerDropdownVisible] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Filtering logic for customers
    const getFilteredCustomers = () => {
        if (!customerSearch) return customers;
        return customers.filter(customer => {
            const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
            return (
                customer.first_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                customer.last_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
                fullName.includes(customerSearch.toLowerCase()) ||
                customer.id.toString().includes(customerSearch)
            );
        });
    };

    // Add item to cart based on input fields (no discounts)
    const addToCart = () => {
        // Generate a unique ID (for simplicity, we're using Date.now())
        const newId = Date.now();
        const cost = parseFloat(data.cost) || 0;

        // Build the new cart item from input values.
        const newItem = {
            id: newId,
            product_name: data.product_name,
            color_name: data.color_name,
            size_values: data.size_values,
            heel_heights: data.heel_heights,
            type_of_heels: data.type_of_heels,
            round: data.round,
            length: data.length,
            back_strap: data.back_strap,
            cost: cost,
            quantity: 1,
            subtotal: cost,
        };

        // Check if an identical item already exists. If so, simply update its quantity.
        const existingItemIndex = data.cart.findIndex(item =>
            item.product_name === newItem.product_name &&
            item.color_name === newItem.color_name &&
            item.size_values === newItem.size_values &&
            item.heel_heights === newItem.heel_heights &&
            item.type_of_heels === newItem.type_of_heels &&
            item.round === newItem.round &&
            item.length === newItem.length &&
            item.back_strap === newItem.back_strap &&
            item.cost === newItem.cost
        );

        let updatedCart = [...data.cart];
        if (existingItemIndex !== -1) {
            // Increase the quantity and update the subtotal if the item already exists.
            const existingItem = updatedCart[existingItemIndex];
            const newQuantity = existingItem.quantity + 1;
            updatedCart[existingItemIndex] = {
                ...existingItem,
                quantity: newQuantity,
                subtotal: newQuantity * existingItem.cost
            };
        } else {
            updatedCart.push(newItem);
        }
        setData('cart', updatedCart);
    };

    // Increment item quantity in cart
    const incrementQuantity = (id) => {
        const updatedCart = data.cart.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + 1;
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal: newQuantity * item.cost
                };
            }
            return item;
        });
        setData('cart', updatedCart);
    };

    // Decrement item quantity in cart, and remove if quantity falls to zero.
    const decrementQuantity = (id) => {
        let updatedCart = data.cart.map(item => {
            if (item.id === id && item.quantity > 1) {
                const newQuantity = item.quantity - 1;
                return {
                    ...item,
                    quantity: newQuantity,
                    subtotal: newQuantity * item.cost
                };
            }
            return item;
        });
        updatedCart = updatedCart.filter(item => item.quantity > 0);
        setData('cart', updatedCart);
    };

    // Remove an item completely from the cart
    const removeFromCart = (id) => {
        const updatedCart = data.cart.filter(item => item.id !== id);
        setData('cart', updatedCart);
    };

    // Recalculate totals whenever cart, shipping cost, or rush order fee changes.
    const totalAmount = data.cart.reduce((acc, item) => acc + item.subtotal, 0);
    const grandTotal = totalAmount + parseFloat(data.shipping_cost || 0) + parseFloat(data.rush_order_fee || 0);
    const balance = data.payment_amount - grandTotal;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Create a FormData instance for file uploads.
        const formData = new FormData();
        data.images.forEach(image => {
            formData.append('images[]', image);
        });

        post('/made_to_orders', {
            data: formData,
            forceFormData: true,
        });
        console.log(data);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        setSelectedFiles(files);
    };

    const removeFile = (indexToRemove) => {
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);
        setData('images', updatedFiles);
    };

    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            total_amount: totalAmount,
            grand_total: grandTotal,
        }));
    }, [data.cart, data.shipping_cost, data.rush_order_fee]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Made To Order - POS
                </h2>
            }
        >
            <div className="grid grid-cols-3 gap-4 p-4">
                {/* Input Fields Section */}
                <div className="col-span-2 rounded-md border p-4 shadow-md">
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel for="product" value="Products" />
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

                        <div>
                            <InputLabel for="color" value="Colors" />
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

                        <div>
                            <InputLabel for="size_value" value="Size Values" />
                            <select
                                className="w-full rounded-md border p-2"
                                value={data.size_values}
                                onChange={(e) => setData('size_values', e.target.value)}
                            >
                                <option value="">Select Size</option>
                                {size_values.map(size_value => (
                                    <option key={size_value.id} value={size_value.size_values}>
                                        {size_value.size_values} - {size_value.size.size_name}
                                    </option>
                                ))}
                                <option value="others">Others</option>
                            </select>
                            <InputError message={errors.size_values} />
                        </div>

                        <div>
                            <InputLabel for="heel_heights" value="Heel Heights" />
                            <select
                                className="w-full rounded-md border p-2"
                                value={data.heel_heights}
                                onChange={(e) => setData('heel_heights', e.target.value)}
                            >
                                <option value="">Select Heel Height</option>
                                {heel_heights.map(heel => (
                                    <option key={heel.id} value={heel.value}>
                                        {heel.value} Inches
                                    </option>
                                ))}
                                <option value="others">Others</option>
                            </select>
                            <InputError message={errors.heel_heights} />
                        </div>

                        <div>
                            <InputLabel for="type_of_heels" value="Type of Heels" />
                            <select
                                className="w-full rounded-md border p-2"
                                value={data.type_of_heels}
                                onChange={(e) => setData('type_of_heels', e.target.value)}
                            >
                                <option value="">Select Type of Heels</option>
                                <option value="b-thick_heel">B-Thick Heel</option>
                                <option value="pin_heel">Pin Heel</option>
                                <option value="block_heel">Block Heel</option>
                                <option value="others">Others</option>
                            </select>
                            <InputError message={errors.type_of_heels} />
                        </div>

                        <div>
                            <InputLabel for="round" value="Round (Add CM/IN after value)" />
                            <TextInput
                                type="text"
                                id="round"
                                name="round"
                                value={data.round}
                                onChange={(e) => setData('round', e.target.value)}
                                className="w-full border px-4 py-2"
                            />
                            <InputError message={errors.round} />
                        </div>

                        <div>
                            <InputLabel for="length" value="Length (Add CM/IN after value)" />
                            <TextInput
                                type="text"
                                id="length"
                                name="length"
                                value={data.length}
                                onChange={(e) => setData('length', e.target.value)}
                                className="w-full border px-4 py-2"
                            />
                            <InputError message={errors.length} />
                        </div>

                        <div>
                            <InputLabel for="back_strap" value="Back Strap (Add CM/IN after value)" />
                            <TextInput
                                type="text"
                                id="back_strap"
                                name="back_strap"
                                value={data.back_strap}
                                onChange={(e) => setData('back_strap', e.target.value)}
                                className="w-full border px-4 py-2"
                            />
                            <InputError message={errors.back_strap} />
                        </div>

                        <div>
                            <InputLabel for="cost" value="Cost" />
                            <TextInput
                                type="number"
                                id="cost"
                                name="cost"
                                value={data.cost}
                                onChange={(e) => setData('cost', e.target.value)}
                                className="w-full border px-4 py-2"
                            />
                            <InputError message={errors.cost} />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            className="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                            onClick={addToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

                {/* Cart Section */}
                <div className="rounded-md border p-4 shadow-md">
                    <h3 className="text-lg font-semibold">Cart</h3>
                    {data.cart.length === 0 ? (
                        <p className="text-gray-500">No items in cart</p>
                    ) : (
                        <div>
                            {data.cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between border-b py-2">
                                    <span>
                                        {item.product_name} - {item.color_name} - 
                                        {item.size_values && `Size: ${item.size_values} -`} 
                                        {item.heel_heights && ` ${item.heel_heights} Inches -`} 
                                        {item.type_of_heels && ` Type: ${item.type_of_heels} - `}
                                        {item.round && ` Round: ${item.round} - `}
                                        {item.length && ` Length: ${item.length} - `}
                                        {item.back_strap && ` Back Strap: ${item.back_strap}`}
                                    </span>
                                    <span>₱{item.cost}</span>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => decrementQuantity(item.id)}
                                            className="mx-1 rounded-md bg-gray-300 px-2 py-1 text-gray-700"
                                        >
                                            -
                                        </button>
                                        <span className="mx-1">{item.quantity}</span>
                                        <button
                                            onClick={() => incrementQuantity(item.id)}
                                            className="mx-1 rounded-md bg-gray-300 px-2 py-1 text-gray-700"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="ml-2 text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <InputError message={errors.cart} />
                    <div className="mt-4">
                        <p className="text-lg font-bold">Total: ₱{totalAmount.toFixed(2)}</p>
                        <Link
                            href="/customers/create"
                            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600"
                        >
                            New Customer
                        </Link>
                        <InputLabel for="customer" value="Customer" />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by ID, First or Last Name"
                                className="w-full rounded-md border p-2"
                                value={customerSearch}
                                onChange={(e) => {
                                    setCustomerSearch(e.target.value);
                                    setCustomerDropdownVisible(true);
                                }}
                                onFocus={() => setCustomerDropdownVisible(true)}
                            />
                            {customerDropdownVisible && (
                                <ul className="absolute z-10 w-full overflow-y-auto rounded border bg-white max-h-40">
                                    {getFilteredCustomers().map(customer => (
                                        <li
                                            key={customer.id}
                                            className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                            onClick={() => {
                                                setData('customer_id', customer.id);
                                                setCustomerSearch(`${customer.first_name} ${customer.last_name} (ID: ${customer.id})`);
                                                setCustomerDropdownVisible(false);
                                            }}
                                        >
                                            {customer.first_name} {customer.last_name} (ID: {customer.id})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <InputError message={errors.customer_id} />

                        <InputLabel for="courier" value="Couriers" />
                        <select
                            className="w-full rounded-md border p-2"
                            value={data.courier_id}
                            onChange={(e) => {
                                const selectedCourierId = e.target.value;
                                setData('courier_id', selectedCourierId);
                                // Update shipping cost based on the selected courier.
                                const courier = couriers.find(c => c.id == selectedCourierId);
                                if (courier) {
                                    setData('shipping_cost', courier.fixed_shipping_cost);
                                }
                            }}
                        >
                            <option value="">Select Courier</option>
                            {couriers.map(courier => (
                                <option key={courier.id} value={courier.id}>
                                    {courier.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.courier_id} />

                        {data.courier_id && (
                            <>
                                <InputLabel for="shipping_cost" value="Shipping Cost" />
                                <input
                                    type="number"
                                    placeholder="Shipping Cost"
                                    className="w-full rounded-md border p-2"
                                    value={data.shipping_cost}
                                    onChange={(e) => setData('shipping_cost', e.target.value)}
                                />
                                <InputLabel for="shoulder_by" value="Shoulder By" />
                                <select
                                    className="w-full rounded-md border p-2"
                                    value={data.shoulder_by}
                                    onChange={(e) => setData('shoulder_by', e.target.value)}
                                >
                                    <option value="bragais">Bragais</option>
                                    <option value="client">Client</option>
                                </select>
                            </>
                        )}
                        <InputError message={errors.shipping_cost} />

                        <InputLabel for="packaging_type_id" value="Packaging Type" />
                        <select
                            className="w-full rounded-md border p-2"
                            value={data.packaging_type_id}
                            onChange={(e) => setData('packaging_type_id', e.target.value)}
                        >
                            <option value="">Select Packaging Type</option>
                            {packaging_types.map(pt => (
                                <option key={pt.id} value={pt.id}>
                                    {pt.packaging_name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.packaging_type_id} />

                        <InputLabel for="payment_method" value="Payment Method" />
                        <select
                            className="w-full rounded-md border p-2"
                            value={data.payment_method_id}
                            onChange={(e) => setData('payment_method_id', e.target.value)}
                        >
                            <option value="">Select Payment Method</option>
                            {payment_methods.map(method => (
                                <option key={method.id} value={method.id}>
                                    {method.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.payment_method_id} />

                        <InputLabel for="rush_order_fee" value="Rush Cost" />
                        <input
                            type="number"
                            placeholder="Rush Order Fee"
                            className="w-full rounded-md border p-2"
                            value={data.rush_order_fee}
                            onChange={(e) => setData('rush_order_fee', e.target.value)}
                        />

                        <InputLabel for="payment_amount" value="Client Payment" />
                        <input
                            type="number"
                            placeholder="Enter Payment Amount"
                            className="w-full rounded-md border p-2"
                            value={data.payment_amount}
                            onChange={(e) => setData('payment_amount', e.target.value)}
                        />
                        <InputError message={errors.payment_amount} />

                        <InputLabel for="remarks" value="Remarks/Note:" />
                        <Textarea
                            className="w-full"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        ></Textarea>
                        <InputError message={errors.remarks} />

                        <p className="mt-2 text-lg font-bold">
                            Grand Total: ₱{grandTotal.toFixed(2)}
                        </p>
                        <p
                            className={`mt-2 text-lg ${balance < 0 ? 'text-red-500' : 'text-green-500'}`}
                        >
                            {balance < 0
                                ? `Balance Due: ₱${Math.abs(balance).toFixed(2)}`
                                : `Change: ₱${balance.toFixed(2)}`}
                        </p>

                        <div className="mt-4">
                            <h1 className="mb-4 text-2xl font-bold">
                                Upload Payment Images (Multiple Allowed)
                            </h1>
                            <input
                                type="file"
                                name="new_images"
                                multiple
                                onChange={handleFileChange}
                                className="rounded border p-2"
                            />
                            {errors.new_images && (
                                <div className="mt-2 text-red-500">{errors.new_images}</div>
                            )}
                            {selectedFiles.length > 0 && (
                                <div className="mt-4">
                                    <h2 className="text-lg font-bold">Selected Files:</h2>
                                    <ul className="list-inside list-disc">
                                        {selectedFiles.map((file, index) => (
                                            <li key={index} className="flex items-center justify-between text-gray-700">
                                                {file.name}
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="ml-2 text-red-500"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSubmit}
                            className={`${
                                data.cart.length === 0 ||
                                data.courier_id === '' ||
                                data.payment_method_id === ''
                                    ? 'bg-green-700'
                                    : 'bg-green-500'
                            } mt-2 w-full rounded-md px-4 py-2 text-white`}
                            disabled={
                                data.cart.length === 0 ||
                                data.courier_id === '' ||
                                data.payment_method_id === ''
                            }
                        >
                            Process Sale
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default MTOPOS;
