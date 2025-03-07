// resources/js/Pages/Inventory/StockLedger.jsx

import React, { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StockLedger = ({ warehouse, ledgers, startDate, endDate, product_variants }) => {
    const [fromDate, setFromDate] = useState(startDate);
    const [toDate, setToDate] = useState(endDate);

    // const [search, setSearch] = useState("");
    // const [color, setColors] = useState("");
    // const [size, setSizes] = useState("");
    // const [sizeValue, setSizeValues] = useState("");
    // const [heelHeight, setHeelHeights] = useState("");
    // const [category, setCategory] = useState("");
    // const [qtyFilter, setQtyFilter] = useState("all"); // New state for quantity filter

    // const filteredProducts = product_variants.filter(stock => {
    //     // Compute overall quantity
    //     const overallQty = stock.total_purchased - stock.total_sold;

    //     // Check quantity filter
    //     let qtyMatches = true;
    //     if (qtyFilter === "positive") {
    //         qtyMatches = overallQty > 0;
    //     } else if (qtyFilter === "zero") {
    //         qtyMatches = overallQty === 0;
    //     } else if (qtyFilter === "negative") {
    //         qtyMatches = overallQty < 0;
    //     }

    //     // Other filters
    //     const matchesFilters = (
    //         (!category || stock.category_id === parseInt(category)) &&
    //         (!size || stock.size_id === parseInt(size)) &&
    //         (!sizeValue || stock.size_value_id === parseInt(sizeValue)) &&
    //         (!heelHeight || stock.heel_height_id === parseInt(heelHeight)) &&
    //         (!color || stock.color_id === parseInt(color))
    //     );

    //     const matchesSearch = search === "" ||
    //         stock.sku.toLowerCase().includes(search.toLowerCase()) ||
    //         stock.colors.color_name.toLowerCase().includes(search.toLowerCase()) ||
    //         stock.categories.category_name.toLowerCase().includes(search.toLowerCase());

    //     return matchesFilters && matchesSearch && qtyMatches;
    // });

    // Function to re-fetch ledger when date filters change
    const updateLedger = () => {
        router.get(
            `/inventory/warehouses/${warehouse.id}/ledger`,
            { start_date: fromDate, end_date: toDate },
            { preserveState: true }
        );
    };

    const exportSimpleExcel = () => {
        // Build header row for the simple report.
        const headerRow = [
            "SKU",
            "Product Name",
            "Color",
            "Size",
            "Size Values",
            "Heel Height",
            "Categories",
            "Movement Type",
            "Date",
            "Quantity",
        ];
    
        // Build data rows.
        let dataRows = [];
        product_variants.forEach(pv => {
            const fixedData = [
                pv.sku,
                pv.product?.product_name || "",
                pv.colors?.color_name || "",
                pv.sizes?.size_name || "",
                pv.size_values?.size_values || "",
                pv.heel_heights?.value || "",
                pv.categories?.category_name || "",
            ];
        
            const ledgerData = ledgers[pv.id];
            if (ledgerData && ledgerData.byDate) {
                // Get sorted entries by date (oldest to latest).
                const sortedDates = Object.entries(ledgerData.byDate)
                .sort((a, b) => a[0].localeCompare(b[0]));
                sortedDates.forEach(([date, dateData]) => {
                // For each ledger entry on this date, create a row.
                (dateData.entries || []).forEach(entry => {
                    const row = [
                    ...fixedData,
                    entry.movement_type,
                    date,
                    Number(entry.total_change)
                    ];
                    dataRows.push(row);
                });
                });
            } else {
                // If no ledger entries exist, output a row with blank movement data.
                const row = [...fixedData, "", "", ""];
                dataRows.push(row);
            }
        });
    
        // Combine header row and data rows.
        const worksheetData = [headerRow, ...dataRows];
        // console.log(worksheetData);
    
        // Create worksheet and workbook.
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
        // Auto-fit columns.
        const colWidths = headerRow.map((header, colIndex) => {
            let maxLength = header ? header.toString().length : 10;
            worksheetData.forEach((row) => {
                const cell = row[colIndex];
                if (cell) {
                maxLength = Math.max(maxLength, cell.toString().length);
                }
            });
            return { wch: maxLength + 2 };
        });
        worksheet["!cols"] = colWidths;
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Simple Stock Ledger");
        XLSX.writeFile(
            workbook,
            `${warehouse.name}_Simple_Stock_Ledger_${new Date().toISOString().split("T")[0]}.xlsx`
        );
    };

    const exportExcel = () => {
        // 1. Determine all unique dates from the ledger data.
        let datesSet = new Set();
        product_variants.forEach(pv => {
            const ledgerData = ledgers[pv.id];
            if (ledgerData && ledgerData.byDate) {
                Object.keys(ledgerData.byDate).forEach(date => datesSet.add(date));
            }
        });
        let dates = Array.from(datesSet).sort(); // sorted array of dates (format: yyyy-mm-dd)
    
        // 2. Build header row.
        let fixedHeaders = ["SKU", "Product Name", "Color", "Size", "Size Values", "Heel Height", "Categories"];
        let headerRow = [...fixedHeaders];
        dates.forEach(date => {
            headerRow.push(
                `${date} (Purchase)`,
                `${date} (Transfer Out)`,
                `${date} (Transfer In)`,
                `${date} (Running Balance)`,
                `${date} (Sold)`
            );
        });
        
        // 3. Build data rows for each product variant.
        let dataRows = [];
        product_variants.forEach(pv => {
            let row = [];
            row.push(
                pv.sku,
                pv.product?.product_name || "",
                pv.colors?.color_name || "",
                pv.sizes?.size_name || "",
                pv.size_values?.size_values || "",
                pv.heel_heights?.value || "",
                pv.categories?.category_name || ""
            );
        
            dates.forEach(date => {
                let dataForDate =
                    (ledgers[pv.id] && ledgers[pv.id].byDate && ledgers[pv.id].byDate[date])
                    || { entries: [], running_balance: 0 };
                const entries = dataForDate.entries || [];
                const purchase = entries
                    .filter(e => e.movement_type === 'purchase')
                    .reduce((sum, e) => sum + Number(e.total_change), 0);
                const transferOut = entries
                    .filter(e => e.movement_type === 'transfer_out')
                    .reduce((sum, e) => sum + Number(e.total_change), 0);
                const transferIn = entries
                    .filter(e => e.movement_type === 'transfer_in')
                    .reduce((sum, e) => sum + Number(e.total_change), 0);
                const sold = entries
                    .filter(e => e.movement_type === 'sold')
                    .reduce((sum, e) => sum + Number(e.total_change), 0);
                const runningBalance = Number(dataForDate.running_balance ?? 0);
                row.push(purchase, transferOut, transferIn, sold, runningBalance);
            });
        
            dataRows.push(row);
        });
        
        // 4. Combine header row and data rows.
        const worksheetData = [headerRow, ...dataRows];
        
        // 5. Create worksheet and workbook.
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        
        // 6. Auto-fit columns: compute maximum width for each column.
        const colWidths = headerRow.map((header, colIndex) => {
            let maxLength = header ? header.toString().length : 10;
            worksheetData.forEach((row) => {
                const cell = row[colIndex];
                if (cell) {
                    maxLength = Math.max(maxLength, cell.toString().length);
                }
            });
            // Add some padding
            return { wch: maxLength + 2 };
        });
        worksheet["!cols"] = colWidths;
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Ledger");
        XLSX.writeFile(
            workbook,
            `${warehouse.name}_Stock_Ledger_${new Date().toISOString().split("T")[0]}.xlsx`
        );
    };
    
    useEffect(() => {
        // console.log(ledgers)
        console.log(product_variants)
    }, [])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Stock Ledger for {warehouse.name}
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                            
                            <div>
                                <label className="block text-sm font-medium">From Date:</label>
                                <input 
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">To Date:</label>
                                <input 
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="border rounded p-2"
                                />
                            </div>
                            <button 
                                onClick={updateLedger}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Update Ledger
                            </button>
                            <button 
                                onClick={exportExcel}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Export to Excel
                            </button>
                            <button 
                                onClick={exportSimpleExcel}
                                className="bg-purple-500 text-white px-4 py-2 rounded"
                            >
                                Export Simple Ledger
                            </button>
                        </div>

                        {/* <nav className="flex items-center justify-center mt-6">
                            {product_variants.links.map((link, index) => {
                                // If link.url is null, disable the link.
                                const isDisabled = !link.url;
                                const classes = isDisabled
                                ? "mx-1 px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                                : link.active
                                ? "mx-1 px-3 py-1 rounded-md text-sm bg-blue-500 text-white"
                                : "mx-1 px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300";

                                return (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={classes}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav> */}

                        {Object.entries(ledgers).length === 0 ? (
                            <p className="text-center text-gray-600">No transactions found for this warehouse.</p>
                        ) : (
                        Object.entries(ledgers).map(([variantId, ledgerData]) => {
                            // Find the product variant from the paginated data (if using pagination, adjust accordingly)
                            const variant = product_variants
                            ? product_variants.find(pv => pv.id === parseInt(variantId))
                            : product_variants.find(pv => pv.id === parseInt(variantId));
                            
                            // Initialize aggregation variables
                            let totalPurchase = 0,
                            totalTransferOut = 0,
                            totalTransferIn = 0,
                            totalSold = 0;

                            // Loop through each date in the ledger and sum up each movement type
                            if (ledgerData.byDate) {
                            Object.values(ledgerData.byDate).forEach(dateData => {
                                (dateData.entries || []).forEach(entry => {
                                    if (entry.movement_type === 'purchase') {
                                        totalPurchase += Number(entry.total_change);
                                    } else if (entry.movement_type === 'transfer_out') {
                                        totalTransferOut += Number(entry.total_change);
                                    } else if (entry.movement_type === 'transfer_in') {
                                        totalTransferIn += Number(entry.total_change);
                                    } else if (entry.movement_type === 'sold') {
                                        totalSold += Number(entry.total_change);
                                    }
                                    });
                                });
                            }
                            // Calculate net change: assuming net = (purchase + transfer_in) - (transfer_out + sold)
                            const net = totalPurchase + totalTransferIn + (totalTransferOut - totalSold);
                            // Calculate running balance as opening balance + net change.
                            const runningBalance = Number(ledgerData.opening_balance) + net;

                            return (
                            <div key={variantId} className="mb-8 p-4 bg-white shadow rounded-lg">
                                <div className="mb-4 border-b pb-2">
                                    <h3 className="text-lg font-bold">
                                        Product Variant ID: {variantId} - Opening Balance: {ledgerData.opening_balance}
                                    </h3>
                                    <h4 className="text-md text-gray-700">
                                        SKU: {variant?.sku || "N/A"} - {variant?.product?.product_name || "Unnamed Product"}
                                    </h4>
                                    {variant && (
                                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                                        {variant.colors && (
                                            <span className="px-2 py-1 bg-gray-100 rounded">{variant.colors.color_name}</span>
                                        )}
                                        {variant.sizes && (
                                            <span className="px-2 py-1 bg-gray-100 rounded">{variant.sizes.size_name}</span>
                                        )}
                                        {variant.size_values && (
                                            <span className="px-2 py-1 bg-gray-100 rounded">{variant.size_values.size_values}</span>
                                        )}
                                        {variant.heelHeights && (
                                            <span className="px-2 py-1 bg-gray-100 rounded">{variant.heelHeights.value}</span>
                                        )}
                                        {variant.categories && (
                                            <span className="px-2 py-1 bg-gray-100 rounded">{variant.categories.category_name}</span>
                                        )}
                                        </div>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Purchase
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Transfer Out
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Transfer In
                                                </th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Sold
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            <tr>
                                                <td className="px-4 py-3 text-sm text-gray-700">{totalPurchase}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{totalTransferOut}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{totalTransferIn}</td>
                                                <td className="px-4 py-3 text-sm text-gray-700">{totalSold}</td>
                                            </tr>
                                            <tr className="bg-gray-100">
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700" colSpan="2">
                                                    Net Change: {net}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-700" colSpan="2">
                                                    Running Balance: {runningBalance}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            );
                        })
                        )}
                        {/* <nav className="flex items-center justify-center mt-6">
                            {product_variants.links.map((link, index) => {
                                // If link.url is null, disable the link.
                                const isDisabled = !link.url;
                                const classes = isDisabled
                                ? "mx-1 px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                                : link.active
                                ? "mx-1 px-3 py-1 rounded-md text-sm bg-blue-500 text-white"
                                : "mx-1 px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-700 hover:bg-gray-300";

                                return (
                                    <Link
                                        key={index}
                                        href={link.url || "#"}
                                        className={classes}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </nav> */}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default StockLedger;
