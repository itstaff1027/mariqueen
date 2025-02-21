import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StockTransactionForm = ({ product_variants, warehouses, stock_levels }) => {
    const [rows, setRows] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [transactionType, setTransactionType] = useState('purchase');
    const [sourceWarehouse, setSourceWarehouse] = useState('');
    const [targetWarehouse, setTargetWarehouse] = useState('');
    const [status, setStatus] = useState('draft');
    const [generalRemarks, setGeneralRemarks] = useState('');
    const [availableVariants, setAvailableVariants] = useState(product_variants);

    // ✅ Update available product variants when transaction type or source warehouse changes
    useEffect(() => {
        console.log(stock_levels);
        if (transactionType === 'transfer' && sourceWarehouse) {
            const filteredVariants = stock_levels
                .filter((stock) => stock.to_warehouse_id.toString() === sourceWarehouse.toString())
                .map((stock) => stock.product_variant);

            setAvailableVariants(filteredVariants);
        } else {
            setAvailableVariants(product_variants);
        }
    }, [transactionType, sourceWarehouse, stock_levels]);

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
    
        console.log(transactionData);
        router.post('/inventory/stock/transactions', transactionData);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Stock Transactions</h2>}>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="container mx-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Stock Transactions</h1>
                                    <div className="space-x-2">
                                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 mt-4" onClick={handleSubmit}>Submit</button>
                                        <button
                                            onClick={handleAddRow}
                                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                        >
                                            Add Row
                                        </button>
                                    </div>
                                    
                                </div>

                                {/* Select Transaction Type */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">Transaction Type:</label>
                                    <select
                                        className="w-full border border-gray-300 rounded px-4 py-2"
                                        value={transactionType}
                                        onChange={handleTransactionTypeChange}
                                    >
                                        <option value="purchase">Purchase</option>
                                        <option value="return">Return</option>
                                        <option value="adjustment">Adjustment</option>
                                        <option value="correction">Correction</option>
                                        <option value="repair">Repair</option>
                                        <option value="transfer">Transfer</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">General Remarks:</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded px-4 py-2"
                                        placeholder="Enter general remarks for this transaction"
                                        value={generalRemarks}
                                        onChange={(e) => setGeneralRemarks(e.target.value)}
                                    />
                                </div>

                                {/* Warehouse Selection */}
                                {transactionType === 'transfer' ? (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2">Source Warehouse:</label>
                                            <select
                                                className="w-full border border-gray-300 rounded px-4 py-2"
                                                value={sourceWarehouse}
                                                onChange={(e) => setSourceWarehouse(e.target.value)}
                                            >
                                                <option value="" disabled>Select Source Warehouse</option>
                                                {warehouses.map((warehouse) => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 font-bold mb-2">Target Warehouse:</label>
                                            <select
                                                className="w-full border border-gray-300 rounded px-4 py-2"
                                                value={targetWarehouse}
                                                onChange={(e) => setTargetWarehouse(e.target.value)}
                                            >
                                                <option value="" disabled>Select Target Warehouse</option>
                                                {warehouses.map((warehouse) => (
                                                    <option key={warehouse.id} value={warehouse.id}>
                                                        {warehouse.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2">Warehouse:</label>
                                        <select
                                            className="w-full border border-gray-300 rounded px-4 py-2"
                                            value={targetWarehouse}
                                            onChange={(e) => setTargetWarehouse(e.target.value)}
                                        >
                                            <option value="" disabled>Select Warehouse</option>
                                            {warehouses.map((warehouse) => (
                                                <option key={warehouse.id} value={warehouse.id}>
                                                    {warehouse.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Table for Stock Entry */}
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2">Product SKU</th>
                                            <th className="border px-4 py-2" hidden={transactionType === 'transfer' ? false : true}>Available Stocks</th>
                                            <th className="border px-4 py-2">Quantity</th>
                                            <th className="border px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => {
                                            // ✅ Find available stock for the selected SKU in the selected source warehouse
                                            const availableStock = stock_levels.find(stock => 
                                                stock.product_variant_id === row.id &&
                                                stock.to_warehouse_id.toString() === sourceWarehouse.toString()
                                            )?.total_stock || 0;

                                            return (
                                                <tr key={index}>
                                                    {/* Product SKU Input with Auto-Filtering Dropdown */}
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
                                                            className="w-full border px-2 py-1 rounded"
                                                            placeholder="Enter Quantity"
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
                                                            disabled={transactionType === 'transfer' && availableStock === 0}
                                                        />
                                                    </td>

                                                    {/* Remove Button */}
                                                    <td className="border px-4 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveRow(index)}
                                                            className="bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600"
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default StockTransactionForm;
