import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const ProductVariantStock = ({ product_variants, warehouses }) => {
    const [rows, setRows] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    const handleAddRow = () => {
        setRows([...rows, { id: '', sku: '', quantity: '', remarks: '' }]); // Use empty id for initialization
    };

    const handleRemoveRow = (id) => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleInputChange = (id, field, value) => {
        const updatedRows = rows.map((row) =>
            row.id === id ? { ...row, [field]: value } : row
        );
        setRows(updatedRows);
    };

    const handleDropdownSelect = (rowIndex, sku, product_variant_id) => {
        const updatedRows = rows.map((row, index) =>
            index === rowIndex ? { ...row, sku, id: product_variant_id } : row
        );
        setRows(updatedRows);
        setDropdownVisible((prev) => ({ ...prev, [rowIndex]: false })); // Close dropdown
    };
    
    const getAvailableProductVariants = (currentSKU) => {
        const selectedSKUs = rows.map((row) => row.sku).filter(Boolean); // Get selected SKUs
        return product_variants.filter((variant) => 
            variant.sku === currentSKU || !selectedSKUs.includes(variant.sku)
        );
    };

    const toggleDropdown = (index) => {
        setDropdownVisible((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleWarehouseChange = (warehouseId) => {
        setSelectedWarehouse(warehouseId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = rows.map((row) => ({
            id: row.id,
            sku: row.sku,
            quantity: row.quantity,
            remarks: row.remarks,
            warehouse_id: selectedWarehouse,
        }));

        console.log(data);
        router.post('/inventory/stocks', { rows: data });
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
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-bold">Product Variants</h1>
                                    <button
                                        onClick={handleAddRow}
                                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                                    >
                                        Add Row
                                    </button>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Select Warehouse:
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded px-4 py-2"
                                        value={selectedWarehouse}
                                        onChange={(e) => handleWarehouseChange(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select a warehouse
                                        </option>
                                        {warehouses.map((warehouse) => (
                                            <option key={warehouse.id} value={warehouse.id}>
                                                {warehouse.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <table className="w-full table-auto border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-2">Product SKU</th>
                                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                                <th className="border border-gray-300 px-4 py-2">Remarks</th>
                                                <th className="border border-gray-300 px-4 py-2">Warehouse</th>
                                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 px-4 py-2 relative">
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                                            placeholder="Search SKU"
                                                            value={row.sku}
                                                            onFocus={() => toggleDropdown(index)}
                                                            onChange={(e) =>
                                                                handleInputChange(row.id, 'sku', e.target.value)
                                                            }
                                                        />
                                                        {dropdownVisible[index] && (
                                                            <ul
                                                                className="absolute z-10 bg-white border border-gray-300 rounded w-full max-h-40 overflow-y-auto"
                                                                style={{ top: '100%' }}
                                                            >
                                                                {getAvailableProductVariants(row.sku)
                                                                    .map((stock) => (
                                                                        <li
                                                                            key={stock.id}
                                                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                                                            onClick={() => handleDropdownSelect(index, stock.sku, stock.id)}
                                                                        >
                                                                            {stock.sku}
                                                                        </li>
                                                                    ))}
                                                            </ul>
                                                        )}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="number"
                                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                                            placeholder="Enter Quantity"
                                                            value={row.quantity}
                                                            onChange={(e) =>
                                                                handleInputChange(row.id, 'quantity', e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                                            placeholder="Enter Remarks"
                                                            value={row.remarks}
                                                            onChange={(e) =>
                                                                handleInputChange(row.id, 'remarks', e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
                                                            value={
                                                                warehouses.find(
                                                                    (w) => w.id.toString() === selectedWarehouse
                                                                )?.name || ''
                                                            }
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveRow(row.id)}
                                                            className="bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default ProductVariantStock;
