import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { usePage, useForm, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import { Textarea } from '@headlessui/react';
import InputError from '@/Components/InputError';
import PromotionModal from '@/Components/Pages/PromotionModal';
import ProductFilters from '@/Components/Pages/Sales/PointOfSales/ProductFilters'

// const CartContext = createContext();
// export function useCart() {
//     return useContext(CartContext);
// }

// function CartProvider({ children }){

//     const { data, setData } = useForm({ cart: [] });

//     const totalAmount = useMemo(
//         () => data.cart.reduce((sum, i) => sum + i.subtotal, 0),
//         [data.cart]
//     );

//     function addToCart(item) {
//         setData('cart', cart => {
//             const idx = cart.findIndex(i => i.sku === item.sku);
//             if (idx > -1) {
//                 const copy = [...cart];
//                 if(copy[idx].quantity < item.total_stock){
//                     copy[idx].quantity++;
//                     copy[idx].subtotal += item.unit_price;
//                 }
//                 return copy;
//             }
//             return [...cart, { ...item, quantity: 1, subtotal: item.unit_price }]
//         })
//     }

//     function updateQuantity(sku, delta) {
//         setData('cart', cart => 
//             cart.map(i => {
//                 if (i.sku === sku) {
//                     const q = Math.max(1, i.quantity + delta);
//                     return { ...i, quantity: q, subtotal: q * i.unit_price};
//                 }
//                 return i;
//             }).filter(i => i.quantity > 0)
//         )
//     }

//     const value = { data, addToCart, updateQuantity, totalAmount };
//     return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }


const POS = ({ 
    stock_lvls, 
    colors, 
    heel_heights, 
    sizes, 
    size_values, 
    categories, 
    user_warehouse, 
    couriers, 
    payment_methods,
    discounts,
    customers,
    packaging_types,
    stock_levels
}) => {
    
    const { data, setData, post, errors } = useForm({
        cart: [],
        filters: { category: null, size: null, heelHeight: null, color: null, size_values: null },
        courier_id: '',
        payment_method_id: '',
        shipping_cost: 0,
        rush_order_fee: '',
        payment_amount: 0,
        total_amount: 0,
        grand_total: 0,
        discount_id: '',
        promotion_id: 0,
        remarks: '',
        fixed_discount: 0,
        customer_id: 0,
        packaging_type_id: '',
        shoulder_by: 'bragais',
        images: []
    });
    
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({});
    const [customerSearch, setCustomerSearch] = useState("");
    const [customerDropdownVisible, setCustomerDropdownVisible] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isClickedPromotion, setIsClickedPromotion] = useState(false);

    const stock = useMemo(() => {
        return stock_levels.data
          .filter(stock => {
            
            const matchesFilters = (
                (!filters.category || stock.category === filters.category) &&
                (!filters.size || stock.size_name === filters.size) &&
                (!filters.size_values || stock.size_value === filters.size_values) &&
                (!filters.heelHeight || stock.heel_height === filters.heelHeight) &&
                (!filters.color || stock.color_name === filters.color)
            );
    
            // console.log(matchesFilters);
        
            const matchesSearch = search === "" || 
                stock.product_sku.toLowerCase().includes(search.toLowerCase()) ||
                stock.color_name.toLowerCase().includes(search.toLowerCase()) ||
                stock.category.toLowerCase().includes(search.toLowerCase());
        
            return matchesFilters && matchesSearch;
          })
      }, [stock_lvls, filters, search]);

    const openPromotionModal = () => {
        setIsClickedPromotion(true);
    };

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


    // Add to Cart with Discount Handling
    const addToCart = (stock) => {
        console.log(stock);
        // 1️⃣ Decide which price we’re actually selling at:
        const disc = stock.discount_price != null
          ? parseFloat(stock.discount_price)
          : null;
        const unit = parseFloat(stock.unit_price) || 0;
        const price = disc !== null ? disc : unit;
      
        // 2️⃣ Try to find an existing line with the same SKU *and* the same price
        const existingIndex = data.cart.findIndex(line =>
          line.sku === stock.product_sku
          && line.price === price
        );

        const totalForThisSku = data.cart.reduce((sum, line) => {
            return line.sku === stock.product_sku
              ? sum + line.quantity
              : sum;
          }, 0);
        // 3️⃣ Clone and update
        const updated = [...data.cart];
        if (existingIndex > -1) {
          // only bump quantity if stock allows
          const line = updated[existingIndex];
          if (totalForThisSku < stock.total_stock) {
            line.quantity++;
            line.subtotal += price;
          }
        } else {
          // 4️⃣ push a brand-new line, including our `price` field
          if(totalForThisSku < stock.total_stock){
            updated.push({
                sku:           stock.product_sku,
                product_id:    stock.product_id,
                product_variant_id: stock.product_variant_id,
                unit_price:    unit,
                discount_price: disc,     // keep around for reference
                price,                    // this is what we compare on
                quantity:      1,
                total_stock:   stock.total_stock,
                subtotal:      price,
                promotion_id: stock.promotion_id ? stock.promotion_id : null,
                // …any other fields you need (e.g. discount_id, promotion_id)…
              });
          }
          
        }
      
        setData('cart', updated);
      };

    // Increment Quantity in Cart
    const incrementQuantity = (sku, promotion_id) => {
        // 1️⃣ Sum every line with this SKU (regardless of price/promo)
        const totalForThisSku = data.cart.reduce((sum, line) => {
          return line.sku === sku
            ? sum + line.quantity
            : sum;
        }, 0);
      
        // 2️⃣ Map over your cart, bumping *only* the matching line if there's room
        const updatedCart = data.cart.map(item => {
            // target the exact line (same sku & same promo entry)
            if (item.sku === sku && item.promotion_id === promotion_id) {
                // if we’ve already hit (or exceeded) stock, don’t increment
                if (totalForThisSku >= item.total_stock) {
                return item;
                }
        
                // otherwise bump
                const newQty = item.quantity + 1;
                const price = parseFloat(item.discount_price ?? item.unit_price) || 0;
                return {
                ...item,
                quantity: newQty,
                subtotal: newQty * price,
                };
            }
        
            // leave every other line untouched
            return item;
        });
      
        setData('cart', updatedCart);
    };

    // Decrement Quantity in Cart
    const decrementQuantity = (sku, promotion_id) => {
        // 1️⃣ Sum every line with this SKU (regardless of price/promo)
        const totalForThisSku = data.cart.reduce((sum, line) => {
            return line.sku === sku
              ? sum + line.quantity
              : sum;
          }, 0);

        let updatedCart = data.cart.map(item => {
            if (item.sku === sku && item.quantity > 1) {
                const newQty = item.quantity - 1;
                const price = parseFloat(item.discount_price ?? item.unit_price) || 0;
                return {
                    ...item,
                    quantity: newQty,
                    subtotal: newQty * price,
                };
            }
            return item;
        });

        setData('cart', updatedCart);
    };

    // Remove item from cart
    const removeFromCart = (sku, promotion_id) => {
        setData('cart', data.cart.filter(item =>
            // keep this item if it does not match BOTH sku and promotion_id
            item.sku  !== sku ||
            item.promotion_id !== promotion_id
          ));
    };

    const addDiscount = (discount_id) => {
        // Find the discount details based on the discount_id.
        
        const foundDiscount = discounts.find(d => d.id == discount_id);
        if (!foundDiscount) {
            setData('discount_id', 0);
            setData('fixed_discount', 0)
            console.error("Discount not found for id", discount_id);
            return;
        }
        // console.log(foundDiscount + 'passed discount_id');
        // console.log(discount_id + 'passed parameter');
        // console.log(data.discount_id);
        // discount_value is already a decimal, e.g., 0.1 for 10%
        if(data.discount_id != discount_id){
            if(foundDiscount.type === 'percentage') {
                const discount_value = Number(foundDiscount.value);

                // Update every item in the cart.
                let updatedCart = data.cart.map(item => {
                    // Use discount_price if available; otherwise, fallback to unit_price.
                    const unitPrice = parseFloat(item.discount_price) || parseFloat(item.unit_price) || 0;

                    // Calculate final unit price: unitPrice * (1 - discount_value)
                    const finalPrice = unitPrice * (1 - discount_value);
                    return { 
                        ...item, 
                        discount_id: discount_id,
                        discount_value: discount_value,
                        subtotal: finalPrice * item.quantity
                    };
                });
                setData('cart', updatedCart);
                setData('discount_id', discount_id)
            }
            else{
                // console.log('clicked');
                
                const discount_value = Number(foundDiscount.value);
                setData('fixed_discount', discount_value)
                // Update every item in the cart.
                let updatedCart = data.cart.map(item => {
                    // Use discount_price if available; otherwise, fallback to unit_price.
                    const unitPrice = parseFloat(item.discount_price) || parseFloat(item.unit_price) || 0;
                    return { 
                        ...item, 
                        discount_id: discount_id,
                        discount_value: discount_value,
                        subtotal: unitPrice * item.quantity
                    };
                });
                setData('cart', updatedCart);
                setData('discount_id', discount_id)
            }
        }else {
            // Update every item in the cart.
            let updatedCart = data.cart.map(item => {
                // Use discount_price if available; otherwise, fallback to unit_price.
                const unitPrice = parseFloat(item.discount_price) || parseFloat(item.unit_price) || 0;

                return { 
                    ...item, 
                    discount_id: 0,
                    discount_value: 0,
                    subtotal: unitPrice * item.quantity
                };
            });
            setData('cart', updatedCart);
            setData('discount_id', 0);
            setData('fixed_discount', 0)
        }

      };
      

    // Calculate total
    const totalAmount = data.cart.reduce((acc, item) => acc + item.subtotal, 0);
    const fixedDiscount = data.fixed_discount ? data.fixed_discount : 0;
    const grandTotal = totalAmount + parseFloat(data.shipping_cost || 0) + parseFloat(data.rush_order_fee || 0) - fixedDiscount;
    // grandTotal = (data.discount_id ? grandTotal * discounts.some(d => d.id === data.discount_id).value : 1)
    const balance = data.payment_amount - grandTotal;
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Create a new FormData instance
        const formData = new FormData();

        // Append each selected file to the FormData
        for (let i = 0; i < data.images.length; i++) {
            formData.append('images[]', data.images[i]);
        }

        post('/point_of_sales', {
            data: formData,
            forceFormData: true,
        });
        console.log(data);
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        setSelectedFiles(files);
    };

    const removeFile = (indexToRemove) => {
        // Filter out the file at the specified index
        const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
        setSelectedFiles(updatedFiles);
        setData('images', updatedFiles);
    };

    useEffect(() => {
        // console.log(stock_levels)
        // console.log(stock_lvls)
        console.log(data.cart)
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

                <ProductFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    search={search}
                    onSearchChange={setSearch}
                    colors={colors}
                    sizes={sizes}
                    heelHeights={heel_heights}
                    sizeValues={size_values}
                    categories={categories}
                />

                <div className="col-span-2 rounded-md border p-4 shadow-md">
                    <div className="py-4 w-full">
                        <div className="space-x-4">
                            <Link
                                href="/customers/create"
                                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                            >
                                New Customer
                            </Link>
                            <button
                                // href="/customers/create"
                                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                onClick={() => openPromotionModal()}
                            >
                                Bundle/BOGO Modal
                            </button>
                        </div>
                        
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {stock.map((stock, index) => (
                            <div key={index} className="w-full flex flex-col rounded-md border p-4">
                                <div className="flex w-full">
                                    <div className="w-1/2 border">
                                        <img src="" alt="text" className="w-full h-1/2 border" />
                                    </div>
                                    <div className="w-1/2 text-right">
                                        <h3 className="text-lg font-semibold">
                                            <u>{stock.product_sku}</u>
                                        </h3>
                                        <h3 className="text-lg font-semibold">
                                            <u>{stock.product_name}</u>
                                        </h3>
                                        <h3 className="text-lg font-semibold">
                                            <u>{stock.color_name}</u>
                                        </h3>
                                        <h3 className="text-lg font-semibold">
                                            S: <u>{stock.size_value}</u>
                                        </h3>
                                        <h3 className="text-lg font-semibold">
                                            IN: <u>{stock.heel_height}</u>
                                        </h3>
                                        
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                   Stock Left - <u> {stock.total_stock}</u>
                                </p>
                                
                                <p className="mt-2 text-lg font-bold">
                                    ₱
                                    {
                                        stock.unit_price 
                                    }
                                </p>
                                
                                {
                                    stock.promotions.length > 0 ? 
                                    <select>
                                        <option onClick = {() => addToCart(stock)}>Add as SRP</option>
                                        {
                                            stock.promotions?.map((promo) => (
                                                <option key={promo.id} onClick={() => addToCart({...stock, discount_price: promo.type == 'discount' ? parseFloat(stock.unit_price) * (1 - parseFloat(promo.discount_value)) : 0, promotion_id: promo.id})}>{promo.name}</option>
                                            ))
                                        }
                                    </select> : <button
                                        onClick={() => addToCart(stock)}
                                        className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white"
                                    >
                                        Add
                                    </button>
                                }
                                
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
                                        {
                                            item.quantity !== 1 && <button
                                                onClick={() =>
                                                    decrementQuantity(item.sku)
                                                }
                                                className="mx-1 rounded-md bg-gray-300 px-2 py-1 text-gray-700"
                                            >
                                                -
                                            </button>

                                        }
                                        
                                        <button
                                            onClick={() =>
                                                incrementQuantity(item.sku, item.promotion_id)
                                            }
                                            className="mx-1 rounded-md bg-gray-300 px-2 py-1 text-gray-700"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.sku, item.promotion_id)
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
                    <InputError message={errors.cart} />
                    <div className="mt-4">
                        <p className="text-lg font-bold">
                            Total: ₱{totalAmount.toFixed(2)}
                        </p>

                        {/* <h1>KULANG NG FETCHING FOR PROMO, BUNDLES</h1> */}
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
                                <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto">
                                    {getFilteredCustomers().map((customer) => (
                                        <li
                                            key={customer.id}
                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                            onClick={() => {
                                                // Update customer_id in form state
                                                setData('customer_id', customer.id);
                                                // Set the search input to the selected customer's name and ID for clarity.
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
                                // If a courier is selected, update shipping cost to its fixed shipping cost.
                                const courier = couriers.find(
                                    (c) => c.id == selectedCourierId,
                                );
                                if (courier) {
                                    setData(
                                        'shipping_cost',
                                        courier.fixed_shipping_cost,
                                    );
                                }
                            }}
                        >
                            <option value="">Select Courier</option>
                            {couriers.map((courier) => (
                                <option key={courier.id} value={courier.id}>
                                    {courier.name}
                                </option>
                            ))}
                        </select>

                        <InputError message={errors.courier_id} />

                        {data.courier_id && (
                            <>
                                <InputLabel
                                    for="shipping_cost"
                                    value="Shipping Cost"
                                />
                                <input
                                    type="number"
                                    placeholder="Shipping Cost"
                                    className="w-full rounded-md border p-2"
                                    value={data.shipping_cost}
                                    onChange={(e) =>
                                        setData('shipping_cost', e.target.value)
                                    }
                                />

                                <InputLabel
                                    for="shoulder_by"
                                    value="Shoulder By"
                                />
                                <select
                                    className="w-full rounded-md border p-2"
                                    value={data.shoulder_by}
                                    onChange={(e) =>
                                        setData('shoulder_by', e.target.value)
                                    }
                                >
                                    <option value='bragais'>Bragais</option>
                                    <option value='client'>Client</option>
                                </select>
                            </>
                        )}
                        <InputError message={errors.shipping_cost} />

                        <InputLabel
                            for="packaging_type_id"
                            value="Packaging Type"
                        />
                        <select
                            className="w-full rounded-md border p-2"
                            value={data.packaging_type_id}
                            onChange={(e) =>
                                setData('packaging_type_id', e.target.value)
                            }
                        >
                            <option value="">Select Packaging Type</option>
                            {packaging_types.map((pt) => (
                                <option key={pt.id} value={pt.id}>
                                    {pt.packaging_name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.packaging_type_id} />

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
                        <InputError message={errors.payment_method_id} />

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
                        <InputError message={errors.payment_amount} />

                        <InputLabel
                            for="remarks"
                            value="Remarks/Note:"
                        />
                        <Textarea
                            className="w-full"
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                        >

                        </Textarea>
                        <InputError message={errors.remarks} />

                        {discounts && data.cart.length > 0 && (
                            <div className="py-4">
                                <label className="block text-sm font-medium text-gray-600">
                                    Apply Discount (Toggle the selected Discount to remove the discount)
                                </label>

                                <select
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={data.discount_id}
                                    // onChange={(e) => addDiscount(e.target.value)}
                                >
                                    <option value="0">- No Discount -</option>
                                    {
                                        discounts.map((discount, i) => (
                                            <option key={i} onClick={(e) => addDiscount(discount.id)} value={discount.id}>{discount.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}

                        {/* 
                        {discounts && data.cart.length > 0 ? (
                            discounts.map((discount, i) => (
                                <button
                                    key={i}
                                    onClick={() => addDiscount(discount.id)}
                                    className={`m-2 rounded-xl p-2 ${
                                        data.discount_id === discount.id
                                            ? 'bg-yellow-700 text-white'
                                            : 'bg-yellow-400 hover:bg-yellow-700 hover:text-white'
                                    }`}
                                >
                                    {discount.name}
                                </button>
                            ))
                        ) : (
                            <h1>No Discounts Available</h1>
                        )} */}

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

                        <div>
                        <h1 className="text-2xl font-bold mb-4">Upload Payment Images (Multiple Allowed)</h1>
                                    <input
                                        type="file"
                                        name="new_images"
                                        multiple
                                        onChange={handleFileChange}
                                        className="border p-2 rounded"
                                    />
                                    {errors.new_images && (
                                        <div className="text-red-500 mt-2">{errors.new_images}</div>
                                    )}

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4">
                                            <h2 className="text-lg font-bold">Selected Files:</h2>
                                            <ul className="list-disc list-inside">
                                                {selectedFiles.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-gray-700 flex items-center justify-between"
                                                    >
                                                        {file.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 ml-2"
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
                            className={`${data.cart.length === 0 ||
                                data.courier_id === '' ||
                                data.payment_method_id === '' ? 'bg-green-700' : 'bg-green-500 '} mt-2 w-full rounded-md px-4 py-2 text-white`}
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
            {isClickedPromotion && (
                <PromotionModal onClose={(close) => setIsClickedPromotion(close)} />
            )}
        </AuthenticatedLayout>
        
    );
};

export default POS;
