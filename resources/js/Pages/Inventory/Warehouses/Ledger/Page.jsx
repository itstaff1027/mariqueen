// resources/js/Pages/Inventory/StockLedger.jsx

import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StockLedger = ({ warehouse, ledgers, startDate, endDate, product_variants }) => {
    const [fromDate, setFromDate] = useState(startDate);
    const [toDate, setToDate] = useState(endDate);

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
        // console.log(product_variants)
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
                        <p className="text-sm text-gray-500 mt-4">
                            Exported Excel will have columns for SKU, Product Name, Color, Size, Size Values, Heel Height, Categories, and dynamic columns for each date (with Beginning, Outgoing, Remaining), plus totals.
                        </p>

                        {Object.entries(ledgers).length === 0 ? (
  <p>No transactions found for this warehouse.</p>
) : (
  Object.entries(ledgers).map(([variantId, ledgerData]) => (
    <div key={variantId} className="mb-8">
      <h3 className="text-lg font-bold mb-2">
        Product Variant ID: {variantId} - Opening Balance: {ledgerData.opening_balance}
      </h3>
      <h3 className="text-lg font-bold mb-2">
        SKU: {product_variants.find(pv => pv.id === parseInt(variantId))?.sku}
      </h3>
      <table className="min-w-full divide-y divide-gray-200 mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Movement Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Change
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Net
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Running Balance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(ledgerData.byDate).length === 0 ? (
            <tr>
              <td className="px-6 py-4 whitespace-nowrap" colSpan="5">
                No transactions in this period.
              </td>
            </tr>
          ) : (
            // Sort dates ascending before mapping.
            Object.entries(ledgerData.byDate)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([date, data]) =>
                data.entries.map((entry, idx) => (
                  <tr key={`${date}-${entry.movement_type}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {idx === 0 ? date : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {entry.movement_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.total_change}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {idx === 0 ? data.daily_net : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {idx === 0 ? data.running_balance : ""}
                    </td>
                  </tr>
                ))
              )
          )}
        </tbody>
      </table>
    </div>
  ))
)}



                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default StockLedger;
