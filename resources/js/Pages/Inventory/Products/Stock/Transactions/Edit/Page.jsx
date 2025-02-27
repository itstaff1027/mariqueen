import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StockTransactionEdit = ({ product_variants, warehouses, stock_transaction, transaction_items, stock_levels }) => {
    const [rows, setRows] = useState(transaction_items.map((item) => {
        const product = product_variants.find(pv => pv.id === item.product_variant_id);
        return {
            id: item.product_variant_id,
            sku: product ? product.sku : "Unknown SKU", // ✅ Prevents undefined error
            quantity: item.quantity
        };
    }));
    
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [transactionType, setTransactionType] = useState(stock_transaction.transaction_type);
    const [sourceWarehouse, setSourceWarehouse] = useState(stock_transaction.from_warehouse_id || '');
    const [targetWarehouse, setTargetWarehouse] = useState(stock_transaction.to_warehouse_id || '');
    const [generalRemarks, setGeneralRemarks] = useState(stock_transaction.remarks || '');
    const [availableVariants, setAvailableVariants] = useState(product_variants);

    // ✅ Load existing transaction items into the form
    useEffect(() => {
        console.log(transaction_items);
        if (stock_transaction.items) {
            setRows(stock_transaction.items.map(item => ({
                id: item.product_variant_id,
                sku: item.product_variant.sku,
                quantity: item.quantity,
            })));
        }
    }, [stock_transaction]);

    // ✅ Update available product variants when transaction type or source warehouse changes
    useEffect(() => {
        if (transactionType === 'transfer' && sourceWarehouse) {
            const filteredVariants = stock_levels
                .map((stock) => stock.product_variant);

            setAvailableVariants(filteredVariants);
        } else {
            setAvailableVariants(product_variants);
        }
    }, [transactionType, sourceWarehouse, transaction_items]);

    // ✅ Prevent duplicate SKUs in dropdown selection
    const getFilteredVariants = () => {
        const selectedSKUs = rows.map((row) => row.sku).filter(Boolean);
        return availableVariants.filter(
            (variant) => !selectedSKUs.includes(variant.sku)
        );
    };

    const handleAddRow = () => {
        setRows([...rows, { id: '', sku: '', quantity: '' }]);
    };

    const handleRemoveRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = rows.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
        );
        setRows(updatedRows);
    };

    const handleDropdownSelect = (index, sku, product_variant_id) => {
        const updatedRows = rows.map((row, i) =>
            i === index ? { ...row, sku, id: product_variant_id } : row
        );
        setRows(updatedRows);
        setDropdownVisible((prev) => ({ ...prev, [index]: false }));
    };

    const toggleDropdown = (index) => {
        setDropdownVisible((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleTransactionTypeChange = (e) => {
        setTransactionType(e.target.value);
        setSourceWarehouse('');
        setTargetWarehouse('');
        setRows([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const transactionData = {
            transaction_type: transactionType,
            remarks: generalRemarks,
            from_warehouse_id: transactionType === 'transfer' ? sourceWarehouse : null,
            to_warehouse_id: targetWarehouse,
            products: rows.map((row) => ({
                product_variant_id: row.id,
                quantity: row.quantity,
            })),
        };

        // console.log(transactionData);
        router.put(`/inventory/stock/transactions/${stock_transaction.id}`, transactionData);
    };

    const updateStatusToPending = (e) => {
        e.preventDefault();

        router.post(`/inventory/stock/transactions/pending/${stock_transaction.id}`);
    }

    const updateStatusToApproved = (e) => {
        e.preventDefault();

        router.post(`/inventory/stock/transactions/approve/${stock_transaction.id}`);
    }

    const updateStatusToRejected = (e) => {
        e.preventDefault();

        router.post(`/inventory/stock/transactions/reject/${stock_transaction.id}`);
    }

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Stock Transactions</h2>}>
            <div className="py-12 flex justify-center">
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 border border-gray-200">
                    {/* Header Section */}
                    <div className="flex w-full justify-between mb-6 border-b pb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Stock Transaction</h1>
                            <p className="text-sm text-gray-500">Transaction ID: #{stock_transaction.id}</p>
                        </div>
                        <div className="space-x-2">
                            {stock_transaction?.status === 'draft' && 
                                <button 
                                    onClick={updateStatusToPending}
                                    className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                                >
                                    Submit
                                </button>
                            }
                            {stock_transaction?.status === 'pending' && 
                                <button 
                                    onClick={updateStatusToApproved}
                                    className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                                >
                                    Approved
                                </button>
                            }
                            {stock_transaction?.status != 'approved' && stock_transaction?.status != 'rejected' &&
                                <button 
                                    onClick={updateStatusToRejected}
                                    className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                                >
                                    Reject
                                </button>
                            }
                            
                        </div>
                    </div>

                    {/* Status & Created At */}
                    <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <label className="text-gray-700 font-semibold">Status:</label>
                            <p className="text-gray-900 font-medium">{stock_transaction.status}</p>
                        </div>
                        <div>
                            <label className="text-gray-700 font-semibold">Created At:</label>
                            <p className="text-gray-900 font-medium">{new Date(stock_transaction.created_at).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Transaction Type (Non-editable) */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold">Transaction Type:</label>
                        <p className="text-gray-900 font-semibold">{transactionType}</p>
                    </div>

                    {/* Warehouse Selection */}
                    <div className="mb-6">
                        
                        {transactionType === 'transfer' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                                {/* Source Warehouse */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Source Warehouse:</label>
                                    <div
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        {warehouses.find(w => w.id === sourceWarehouse)?.name || ''}
                                    </div>
                                </div>

                                {/* Target Warehouse */}
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Target Warehouse:</label>
                                    <div
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 transition"
                                    >
                                        {warehouses.find(w => w.id === targetWarehouse)?.name || ''}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                <label className="block text-gray-700 font-medium mb-1">Warehouse:</label>
                                <div
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 transition"
                                >
                                    {warehouses.find(w => w.id === targetWarehouse)?.name || ''}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* General Remarks */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold">General Remarks:</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 transition"
                            value={generalRemarks}
                            onChange={(e) => setGeneralRemarks(e.target.value)}
                            disabled={stock_transaction?.status === 'draft' ? false : true}
                        />
                    </div>

                    {/* Product Table with SKU Dropdown & Available Stock Column */}
                    <div className="border border-gray-200 rounded-lg h-[500px] overflow-y-auto mb-6 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-3 text-gray-600">Product SKU</th>
                                    {transactionType === 'transfer' && <th className="border px-4 py-3 text-gray-600">Available Stock</th>}
                                    <th className="border px-4 py-3 text-gray-600">Quantity</th>
                                    <th className="border px-4 py-3 text-gray-600" hidden={stock_transaction?.status === 'draft' ? false : true}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rows.map((row, index) => {
                                    const availableStock = stock_levels.find(stock => 
                                        stock.product_variant_id === row.id
                                    )?.total_stock || 0;
                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            {/* Product SKU Dropdown Input */}
                                            <td className="border px-4 py-2 relative">
                                                <input
                                                    type="text"
                                                    className="w-full border px-2 py-1 rounded"
                                                    placeholder="Search SKU"
                                                    value={row.sku}
                                                    onChange={(e) => {
                                                        handleInputChange(index, 'sku', e.target.value);
                                                        toggleDropdown(index);
                                                    }}
                                                    onFocus={() => toggleDropdown(index)}
                                                    disabled={stock_transaction?.status === 'draft' ? false : true}
                                                />
                                                {dropdownVisible[index] && (
                                                    <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto">
                                                        {getFilteredVariants().filter(variant => 
                                                            variant.sku.toLowerCase().includes(row.sku.toLowerCase())
                                                        ).map((variant) => (
                                                            <li
                                                                key={variant.id}
                                                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                                                onClick={() => handleDropdownSelect(index, variant.sku, variant.id)}
                                                                disabled={stock_transaction?.status === 'draft' ? false : true}
                                                            >
                                                                {variant.sku}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>

                                            {/* Available Stock Display (Only for Transfers) */}
                                            {transactionType === 'transfer' && (
                                                <td className="border px-4 py-2 text-center">
                                                    {availableStock > 0 ? (
                                                        <span className="text-green-600 font-bold">{availableStock} Available</span>
                                                    ) : (
                                                        <span className="text-red-600 font-bold">Out of Stock</span>
                                                    )}
                                                </td>
                                            )}

                                            {/* Quantity Input */}
                                            <td className="border px-4 py-2">
                                                <input 
                                                    type="number" 
                                                    className="border rounded px-3 py-1 w-full focus:ring-2 focus:ring-blue-400 transition"
                                                    value={row.quantity}
                                                    onChange={(e) => {
                                                        let enteredQuantity = parseInt(e.target.value, 10) || 0;
                                                        if (transactionType === 'transfer' && enteredQuantity > availableStock) {
                                                            enteredQuantity = availableStock; // Prevent over-requesting stock
                                                        }
                                                        handleInputChange(index, 'quantity', enteredQuantity);
                                                    }}
                                                    min="1"
                                                    max={transactionType === 'transfer' ? availableStock : ''}
                                                    // disabled={transactionType === 'transfer' && availableStock === 0 }
                                                    disabled={stock_transaction?.status === 'draft' ? false : true}
                                                    
                                                />
                                            </td>

                                            {/* Remove Button */}
                                            <td className="border px-4 py-2" hidden={stock_transaction?.status === 'draft' ? false : true}>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveRow(index)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons Section */}
                    <div className="flex justify-between items-center">
                        {stock_transaction?.status === 'draft' && <>
                                <button 
                                    onClick={handleAddRow}
                                    className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                                >
                                    Add Product
                                </button>

                                <button 
                                    onClick={handleSubmit}
                                    className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                                >
                                    Save Changes
                                </button>
                            </>
                        }
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default StockTransactionEdit;
