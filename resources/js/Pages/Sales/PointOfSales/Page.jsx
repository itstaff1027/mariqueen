import React, { useState, useEffect } from 'react';
import { usePage, useForm } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';

const POS = ({ stock_levels, colors, heel_heights, sizes, size_values, categories, user_warehouse, couriers, payment_methods }) => {
    
    const { data, setData, post, errors } = useForm({
        cart: [],
        filters: { category: null, size: null, heelHeight: null, color: null, size_values: null },
        courier_id: '',
        payment_method_id: '',
        shipping_cost: 0,
        rush_order_fee: 0,
        payment_amount: 0,
        total_amount: 0,
        grand_total: 0,
    });
    
    const [search, setSearch] = useState("");


    // Add to Cart with Discount Handling
    const addToCart = (stock) => {
        const unitPrice = parseFloat(stock.product_variant.discount_price) || parseFloat(stock.product_variant.unit_price) || 0;
    
        const existingItemIndex = data.cart.findIndex(item => item.sku === stock.product_variant.sku);
    
        let updatedCart = [...data.cart];
    
        if (existingItemIndex !== -1) {
            if (updatedCart[existingItemIndex].quantity < stock.total_stock) {
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: updatedCart[existingItemIndex].quantity + 1,
                    subtotal: updatedCart[existingItemIndex].subtotal + unitPrice
                };
            }
        } else {
            updatedCart.push({
                // ...stock.product_variant,
                product_variant_id: stock.product_variant.id,
                product_id: stock.product_variant.product_id,
                sku: stock.product_variant.sku,
                quantity: 1,
                total_stock: stock.total_stock,
                subtotal: unitPrice,
            });
        }
    
        setData('cart', updatedCart);
    };
    

    // Increment Quantity in Cart
    const incrementQuantity = (sku) => {
        const updatedCart = data.cart.map(item => {
            if (item.sku === sku && item.quantity < item.total_stock) {
                const newQuantity = item.quantity + 1;
                const unitPrice = parseFloat(item.discount_price) || parseFloat(item.unit_price);
                return { 
                    ...item, 
                    quantity: newQuantity, 
                    subtotal: newQuantity * unitPrice 
                };
            }
            return item;
        });

        setData('cart', updatedCart);
    };

    // Decrement Quantity in Cart
    const decrementQuantity = (sku) => {
        let updatedCart = data.cart.map(item => {
            if (item.sku === sku && item.quantity > 1) {
                const newQuantity = item.quantity - 1;
                const unitPrice = parseFloat(item.discount_price) || parseFloat(item.unit_price);
                return { 
                    ...item, 
                    quantity: newQuantity, 
                    subtotal: newQuantity * unitPrice 
                };
            }
            return item;
        });

        // Remove items with quantity 0 or less
        updatedCart = updatedCart.filter(item => item.quantity > 0);

        setData('cart', updatedCart);
    };


    // Remove item from cart
    const removeFromCart = (sku) => {

        let updatedCart = data.cart.filter((item) => item.sku !== sku);

        setData('cart', updatedCart);
    };

    // Calculate total
    const totalAmount = data.cart.reduce((acc, item) => acc + item.subtotal, 0);
    const grandTotal = totalAmount + parseFloat(data.shipping_cost || 0) + parseFloat(data.rush_order_fee || 0);
    const balance = data.payment_amount - grandTotal;

    // Filter products based on warehouse and other criteria
    const filteredProducts = stock_levels.filter(stock => {
        const matchesFilters = (
            (!data.filters.category || stock.product_variant.category_id === parseInt(data.filters.category)) &&
            (!data.filters.size || stock.product_variant.size_id === parseInt(data.filters.size)) &&
            (!data.filters.size_values || stock.product_variant.size_value_id === parseInt(data.filters.size_values)) &&
            (!data.filters.heelHeight || stock.product_variant.heel_height_id === parseInt(data.filters.heelHeight)) &&
            (!data.filters.color || stock.product_variant.color_id === parseInt(data.filters.color))
        );

        // console.log(matchesFilters);
    
        const matchesSearch = search === "" || 
            stock.product_variant.sku.toLowerCase().includes(search.toLowerCase()) ||
            stock.product_variant.colors.color_name.toLowerCase().includes(search.toLowerCase()) ||
            stock.product_variant.categories.category_name.toLowerCase().includes(search.toLowerCase());
    
        return matchesFilters && matchesSearch;
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(data);
    }

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            total_amount: totalAmount,
            grand_total: grandTotal,
        }));
    }, [data.cart, data.shipping_cost, data.rush_order_fee]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Point of Sale - Warehouse: {user_warehouse}
                </h2>
            }
        >
            <div className="grid grid-cols-3 gap-4 p-4">
                {/* Filters */}
                <div className="col-span-3 mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    <select
                        value={data.filters.category || ''}
                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                        onChange={(e) =>
                            setData('filters', {
                                ...data.filters,
                                category: e.target.value
                                    ? parseInt(e.target.value)
                                    : null,
                            })
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
                        value={data.filters.size || ''}
                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                        onChange={(e) =>
                            setData('filters', {
                                ...data.filters,
                                size: e.target.value
                                    ? parseInt(e.target.value)
                                    : null,
                            })
                        }
                    >
                        <option value="">All Sizes</option>
                        {sizes.map((size) => (
                            <option key={size.id} value={size.id}>
                                {size.size_name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={data.filters.size_values || ''}
                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                        onChange={(e) =>
                            setData('filters', {
                                ...data.filters,
                                size_values: e.target.value
                                    ? parseInt(e.target.value)
                                    : null,
                            })
                        }
                    >
                        <option value="">Size Values</option>
                        {size_values.map((size_value) => (
                            <option key={size_value.id} value={size_value.id}>
                                {size_value.size_values}
                            </option>
                        ))}
                    </select>

                    <select
                        value={data.filters.heelHeight || ''}
                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                        onChange={(e) =>
                            setData('filters', {
                                ...data.filters,
                                heelHeight: e.target.value
                                    ? parseInt(e.target.value)
                                    : null,
                            })
                        }
                    >
                        <option value="">All Heel Heights</option>
                        {heel_heights.map((height) => (
                            <option key={height.id} value={height.id}>
                                {height.value}
                            </option>
                        ))}
                    </select>

                    <select
                        value={data.filters.color || ''}
                        className="rounded-md border p-2 shadow-sm focus:outline-none"
                        onChange={(e) =>
                            setData('filters', {
                                ...data.filters,
                                color: e.target.value
                                    ? parseInt(e.target.value)
                                    : null,
                            })
                        }
                    >
                        <option value="">All Colors</option>
                        {colors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.color_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2 rounded-md border p-4 shadow-md">
                    <input
                        type="text"
                        placeholder="Search for a product..."
                        className="w-full rounded-md border p-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {filteredProducts.map((stock, index) => (
                            <div key={index} className="rounded-md border p-4">
                                <h3 className="text-lg font-semibold">
                                    SKU: {stock.product_variant.sku}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Stock: {stock.total_stock}
                                </p>
                                <p className="mt-2 text-lg font-bold">
                                    ₱
                                    {stock.product_variant.discount_price ||
                                        stock.product_variant.unit_price}
                                </p>
                                <button
                                    onClick={() => addToCart(stock)}
                                    className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Section */}
                <div className="rounded-md border p-4 shadow-md">
                    <h3 className="text-lg font-semibold">Cart</h3>
                    {data.cart.length === 0 ? (
                        <p className="text-gray-500">No items in cart</p>
                    ) : (
                        <div>
                            {data.cart.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b py-2"
                                >
                                    <span>
                                        {item.sku} (x{item.quantity})
                                    </span>
                                    <span>
                                        ₱
                                        {parseFloat(item.subtotal || 0).toFixed(
                                            2,
                                        )}
                                    </span>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() =>
                                                decrementQuantity(item.sku)
                                            }
                                            className="mx-1 rounded-md bg-gray-300 px-2 py-1 text-gray-700"
                                        >
                                            -
                                        </button>
                                        <button
                                            onClick={() =>
                                                incrementQuantity(item.sku)
                                            }
                                            className="mx-1 rounded-md bg-gray-300 px-2 py-1 text-gray-700"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.sku)
                                            }
                                            className="ml-2 text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <p className="text-lg font-bold">
                            Total: ₱{totalAmount.toFixed(2)}
                        </p>

                        <h1>
                            KULANG NG FETCHING FOR DISCOUNTS, PROMO, BUNDLES,
                            ADD NG CUSTOMER
                        </h1>
                        <InputLabel for="courier" value="Couriers" />
                        <select
                            className="w-full rounded-md border p-2"
                            value={data.courier_id}
                            onChange={(e) =>
                                setData('courier_id', e.target.value)
                            }
                        >
                            <option value="">Select Courier</option>
                            {couriers.map((courier) => (
                                <option key={courier.id} value={courier.id}>
                                    {courier.name}
                                </option>
                            ))}
                        </select>
                        <InputLabel
                            for="payment_method"
                            value="Payment Method"
                        />
                        <select
                            className="w-full rounded-md border p-2"
                            value={data.payment_method_id}
                            onChange={(e) =>
                                setData('payment_method_id', e.target.value)
                            }
                        >
                            <option value="">Select Payment Method</option>
                            {payment_methods.map((method) => (
                                <option key={method.id} value={method.id}>
                                    {method.name}
                                </option>
                            ))}
                        </select>

                        <InputLabel for="shipping_cost" value="Shipping Cost" />
                        <input
                            type="number"
                            placeholder="Shipping Cost"
                            className="w-full rounded-md border p-2"
                            value={data.shipping_cost}
                            onChange={(e) =>
                                setData('shipping_cost', e.target.value)
                            }
                        />

                        <InputLabel for="rush_order_fee" value="Rush Cost" />
                        <input
                            type="number"
                            placeholder="Rush Order Fee"
                            className="w-full rounded-md border p-2"
                            value={data.rush_order_fee}
                            onChange={(e) =>
                                setData('rush_order_fee', e.target.value)
                            }
                        />

                        <InputLabel
                            for="payment_amount"
                            value="Client Payment"
                        />
                        <input
                            type="number"
                            placeholder="Enter Payment Amount"
                            className="w-full rounded-md border p-2"
                            value={data.payment_amount}
                            onChange={(e) =>
                                setData('payment_amount', e.target.value)
                            }
                        />

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
                        <button
                            onClick={handleSubmit}
                            className="mt-2 w-full rounded-md bg-green-500 px-4 py-2 text-white"
                        >
                            Process Sale
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default POS;
