import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InventoryLayout from '@/Layouts/InventoryLayout';
import axios from 'axios';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Select } from '@headlessui/react';

const StockTransactionForm = ({ product_variants, warehouses, stock_levels, batches }) => {
    const [rows, setRows] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState({});
    const [transactionType, setTransactionType] = useState('purchase');
    const [sourceWarehouse, setSourceWarehouse] = useState('');
    const [targetWarehouse, setTargetWarehouse] = useState('');
    const [status, setStatus] = useState('draft');
    const [generalRemarks, setGeneralRemarks] = useState('');
    const [availableVariants, setAvailableVariants] = useState(product_variants);
    const [stockLevels, setStockLevels] = useState([]);

    const [errors, setError] = useState('');



    // ✅ Update available product variants when transaction type or source warehouse changes
    useEffect(() => {
        // console.log(stock_levels);
        console.log(sourceWarehouse);
        if (transactionType === 'transfer' && sourceWarehouse) {
            const filteredVariants = stockLevels
                .filter((stock) => stock.warehouse_id.toString() === sourceWarehouse.toString())
                .map((stock) => stock.product_variant);

            setAvailableVariants(filteredVariants);
        } else {
            setAvailableVariants(product_variants);
        }
    }, [transactionType, sourceWarehouse, stockLevels]);

    // Helper for purchase variants (all available variants not already selected)
    const getPurchaseVariants = () => {
        const selectedSKUs = rows.map((row) => row.sku).filter(Boolean);
        return product_variants.filter(
            (variant) => !selectedSKUs.includes(variant.sku)
        );
    };
    
    // Helper for transfer variants: filter by stock in the source warehouse
    const getTransferVariants = () => {
        const selectedSKUs = rows.map((row) => row.sku).filter(Boolean);
        // Use stock_levels to filter only variants with available stock for the selected source warehouse.
        const variantsWithStock = stockLevels
            .map(stock => stock.product_variant);

            console.log(stockLevels);
        return variantsWithStock.filter(
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
        router.post('/inventory/stock/transactions', transactionData, {
            onError: (errors) => {
                setError(errors);
                console.log(errors);
            }
        });
    };

    const getStockMovements = (warehouse_id) => {
        axios.get(route('stock_movements', {id: warehouse_id}))
        .then(response => {
            // response.data contains the fetched data
            console.log(response.data);
            setStockLevels(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };

    return (
        <InventoryLayout 
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Stock Transactions
                    </h2>
                </div>
            }
        
        >
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
                        <InputError message={errors.transaction_type} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">General Remarks:</label>
                        <textarea
                            className="w-full border border-gray-300 rounded px-4 py-2"
                            placeholder="Enter general remarks for this transaction"
                            value={generalRemarks}
                            onChange={(e) => setGeneralRemarks(e.target.value)}
                        />
                        <InputError message={errors.remarks} />
                    </div>

                    <div className="mb-4">
                        <InputLabel for="batch_id" value="Select Batch" />
                        <Select>
                            {batches?.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {/* Warehouse Selection */}
                    {transactionType === 'transfer' ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Source Warehouse:</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-4 py-2"
                                    value={sourceWarehouse}
                                    onChange={(e) => {
                                        setSourceWarehouse(e.target.value)
                                        getStockMovements(e.target.value)
                                    }}
                                >
                                    <option value="" disabled>Select Source Warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.from_warehouse_id} />
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
                                <InputError message={errors.to_warehouse_id} />
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
                            <InputError message={errors.to_warehouse_id} />
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
                                const availableStock = stockLevels.find(stock => 
                                    stock.product_variant_id === row.id
                                )?.total_stock || 0;

                                return (
                                    <tr key={index}>
                                        {/* Product SKU Input with Auto-Filtering Dropdown */}
                                        <td className="relative border px-4 py-2">
                                            {transactionType === 'transfer' ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded border px-2 py-1"
                                                        placeholder="Search SKU (Transfer)"
                                                        value={row.sku}
                                                        onChange={(e) => {
                                                            handleInputChange(
                                                                index,
                                                                'sku',
                                                                e.target.value,
                                                            );
                                                            toggleDropdown(
                                                                index,
                                                            );
                                                        }}
                                                        onFocus={() =>
                                                            toggleDropdown(
                                                                index,
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.products
                                                                .index
                                                                .product_variant_id
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded border px-2 py-1"
                                                        placeholder="Search SKU (Purchase)"
                                                        value={row.sku}
                                                        onChange={(e) => {
                                                            handleInputChange(
                                                                index,
                                                                'sku',
                                                                e.target.value,
                                                            );
                                                            toggleDropdown(index);
                                                        }}
                                                        onFocus={() =>
                                                            toggleDropdown(index)
                                                        }
                                                    />
                                                    {/* <InputError
                                                        message={
                                                            errors.products
                                                        }
                                                    /> */}
                                                </>
                                                
                                            )}
                                            {transactionType === 'transfer'
                                                ? dropdownVisible[index] && (
                                                      <ul className="absolute z-10 max-h-40 w-full overflow-y-auto rounded border bg-white">
                                                          {getTransferVariants().map(
                                                              (variant) => (
                                                                  <li
                                                                      key={
                                                                          variant.id
                                                                      }
                                                                      className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                                                      onClick={() =>
                                                                          handleDropdownSelect(
                                                                              index,
                                                                              variant.sku,
                                                                              variant.id,
                                                                          )
                                                                      }
                                                                  >
                                                                      {
                                                                          variant.sku
                                                                      }
                                                                  </li>
                                                              ),
                                                          )}
                                                          {/* <InputError message={errors.products.product_variant_id} /> */}
                                                      </ul>
                                                  )
                                                : dropdownVisible[index] && (
                                                      <ul className="absolute z-10 max-h-40 w-full overflow-y-auto rounded border bg-white">
                                                          {getPurchaseVariants()
                                                              .filter(
                                                                  (variant) =>
                                                                      variant.sku
                                                                          .toLowerCase()
                                                                          .includes(
                                                                              row.sku.toLowerCase(),
                                                                          ),
                                                              )
                                                              .map(
                                                                  (variant) => (
                                                                      <li
                                                                          key={
                                                                              variant.id
                                                                          }
                                                                          className="cursor-pointer px-4 py-2 hover:bg-gray-200"
                                                                          onClick={() =>
                                                                              handleDropdownSelect(
                                                                                  index,
                                                                                  variant.sku,
                                                                                  variant.id,
                                                                              )
                                                                          }
                                                                      >
                                                                          {
                                                                              variant.sku
                                                                          }
                                                                      </li>
                                                                  ),
                                                              )}
                                                      </ul>
                                                  )}
                                        </td>

                                        {/* Available Stock Display (Only for Transfers) */}
                                        {transactionType === 'transfer' && (
                                            <td className="border px-4 py-2 text-center">
                                                {availableStock > 0 ? (
                                                    <span className="font-bold text-green-600">
                                                        {availableStock}{' '}
                                                        Available
                                                    </span>
                                                ) : (
                                                    <span className="font-bold text-red-600">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </td>
                                        )}

                                        {/* Quantity Input */}
                                        <td className="border px-4 py-2">
                                            <input
                                                type="number"
                                                className="w-full rounded border px-2 py-1"
                                                placeholder="Enter Quantity"
                                                value={row.quantity}
                                                onChange={(e) => {
                                                    let enteredQuantity =
                                                        parseInt(
                                                            e.target.value,
                                                            10,
                                                        ) || 0;
                                                    if (
                                                        transactionType ===
                                                            'transfer' &&
                                                        enteredQuantity >
                                                            availableStock
                                                    ) {
                                                        enteredQuantity =
                                                            availableStock; // Prevent over-requesting stock
                                                    }
                                                    handleInputChange(
                                                        index,
                                                        'quantity',
                                                        enteredQuantity,
                                                    );
                                                }}
                                                min="1"
                                                max={
                                                    transactionType ===
                                                    'transfer'
                                                        ? availableStock
                                                        : ''
                                                }
                                                disabled={
                                                    transactionType ===
                                                        'transfer' &&
                                                    availableStock === 0
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.transaction_type
                                                }
                                            />
                                        </td>

                                        {/* Remove Button */}
                                        <td className="border px-4 py-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveRow(index)
                                                }
                                                className="rounded bg-red-500 px-2 py-1 text-white shadow hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <InputError message={errors.products} />
                    </table>
                </div>
            </div>
        </InventoryLayout>
    );
};

export default StockTransactionForm;
