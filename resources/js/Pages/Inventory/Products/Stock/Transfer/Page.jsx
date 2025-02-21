import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ProductVariantStockTransfer = ({ product_variants, warehouses, stock_levels }) => {
    const [rows, setRows] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [sourceWarehouse, setSourceWarehouse] = useState('');
    const [filteredSKUs, setFilteredSKUs] = useState([]);

    // ✅ Fetch Available SKUs for Selected Source Warehouse
    useEffect(() => {
        console.log(stock_levels);
        if (sourceWarehouse) {
            const availableStock = stock_levels.filter(stock => stock.to_warehouse_id.toString() === sourceWarehouse.toString());
            setFilteredSKUs(availableStock);
        }
    }, [sourceWarehouse, stock_levels]);

    // ✅ Add Row for SKU Selection
    const handleAddRow = () => {
        setRows([...rows, { id: '', sku: '', quantity: 0, remarks: '' }]);
    
        // ✅ Recalculate available SKUs when adding a new row
        setFilteredSKUs(getFilteredSKUs());
    };

    // ✅ Remove Row
    const handleRemoveRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    // ✅ Handle Input Changes
    const handleInputChange = (index, field, value) => {
        const updatedRows = rows.map((row, i) => 
            i === index ? { ...row, [field]: value } : row
        );
        setRows(updatedRows);
    };

    // ✅ Search for Matching SKUs
    const handleSearchSKU = (index, value) => {
        handleInputChange(index, 'sku', value);
        
        // Use getFilteredSKUs to avoid duplicates
        setFilteredSKUs(getFilteredSKUs(value));
    
        setDropdownVisible((prev) => ({ ...prev, [index]: true }));
    };

    // ✅ Select SKU from Dropdown
    const handleDropdownSelect = (index, sku, product_variant_id) => {
        const updatedRows = rows.map((row, i) =>
            i === index ? { ...row, sku, id: product_variant_id } : row
        );
        setRows(updatedRows);
    
        // ✅ Recalculate available SKUs after selection
        setFilteredSKUs(getFilteredSKUs());
    
        // ✅ Close dropdown after selection
        setDropdownVisible((prev) => ({ ...prev, [index]: false }));
    };
    

    const getFilteredSKUs = () => {
        const selectedSKUs = rows.map(row => row.sku).filter(Boolean); // ✅ Get selected SKUs
        return stock_levels.filter(stock =>
            stock.to_warehouse_id.toString() === sourceWarehouse.toString() &&
            !selectedSKUs.includes(stock.product_variant.sku) // ✅ Exclude already selected SKUs
        );
    };
    

    // ✅ Handle Warehouse Selection
    const handleWarehouseChange = (warehouseId) => {
        setSelectedWarehouse(warehouseId);
    };

    const handleSourceWarehouseChange = (warehouseId) => {
        setSourceWarehouse(warehouseId);
    };

    // ✅ Submit Transfer with Validation
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedWarehouse || !sourceWarehouse) {
            alert("Please select both Source and Destination Warehouses!");
            return;
        }

        const transferData = rows.map((row) => {
            if (!row.sku || !row.id) {
                alert("All rows must have a valid SKU selected!");
                return null;
            }

            if (row.quantity <= 0) {
                alert(`Quantity for SKU ${row.sku} must be greater than 0!`);
                return null;
            }

            // ✅ Check Available Stock in Source Warehouse
            const stockRecord = stock_levels.find(stock => 
                stock.product_variant_id === row.id && 
                stock.to_warehouse_id.toString() === sourceWarehouse.toString()
            );
            
            const availableStock = stockRecord ? stockRecord.total_stock : 0;

            if (availableStock < row.quantity) {
                alert(`Not enough stock in Source Warehouse for SKU ${row.sku}. Available: ${availableStock}`);
                return null;
            }

            return {
                id: row.id,
                sku: row.sku,
                quantity: row.quantity,
                remarks: row.remarks,
                from_warehouse_id: sourceWarehouse,
                to_warehouse_id: selectedWarehouse,
            };
        }).filter(Boolean);

        if (transferData.length === 0) {
            alert("No valid transfers to process!");
            return;
        }

        console.log("Submitting Transfer:", transferData);
        router.post('/inventory/store/stock/transfer', { transfers: transferData });
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Stock Transfer</h2>}>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-md rounded-lg h-[1000px]">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-6">Stock Transfer</h1>

                            {/* Source Warehouse Selection */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Source Warehouse:</label>
                                <select className="w-full border rounded px-4 py-2" value={sourceWarehouse} onChange={(e) => handleSourceWarehouseChange(e.target.value)}>
                                    <option value="" disabled>Select Source Warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Destination Warehouse Selection */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Destination Warehouse:</label>
                                <select className="w-full border rounded px-4 py-2" value={selectedWarehouse} onChange={(e) => handleWarehouseChange(e.target.value)}>
                                    <option value="" disabled>Select Destination Warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                    ))}
                                </select>
                            </div>

                            <button onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 mb-4">
                                Add Row
                            </button>

                            <form onSubmit={handleSubmit}>
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-4 py-2">Product SKU</th>
                                            <th className="border px-4 py-2">Quantity</th>
                                            <th className="border px-4 py-2">Remarks</th>
                                            <th className="border px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                <td className="border px-4 py-2 relative">
                                                <input
                                                    type="text"
                                                    className="w-full border rounded px-2 py-1"
                                                    placeholder="Search SKU"
                                                    value={row.sku}
                                                    onChange={(e) => handleSearchSKU(index, e.target.value)}
                                                    onFocus={() => setDropdownVisible((prev) => ({ ...prev, [index]: true }))} // ✅ Always open on focus
                                                />
                                                {dropdownVisible[index] && getFilteredSKUs().length > 0 && (
                                                    <ul className="absolute z-10 bg-white border rounded w-full max-h-40 overflow-y-auto">
                                                        {getFilteredSKUs().map((stock, idx) => (
                                                            <li 
                                                                key={`${stock.product_variant_id}-${idx}`} 
                                                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer" 
                                                                onClick={() => handleDropdownSelect(index, stock.product_variant.sku, stock.product_variant_id)}
                                                            >
                                                                {stock.product_variant.sku} (Available: {stock.total_stock})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                            </td>
                                                <td className="border px-4 py-2">
                                                    <input type="number" className="w-full border rounded px-2 py-1" value={row.quantity} onChange={(e) => handleInputChange(index, 'quantity', e.target.value)} />
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <input type="text" className="w-full border rounded px-2 py-1" value={row.remarks} onChange={(e) => handleInputChange(index, 'remarks', e.target.value)} />
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <button type="button" onClick={() => handleRemoveRow(index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remove</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">Submit Transfer</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductVariantStockTransfer;
