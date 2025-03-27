import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import SalesLayout from '@/Layouts/SalesLayout';

const Sales = ({ sizes }) => {

    return (
        <SalesLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Sales
                </h2>
            }
        >
            Sales
            Flexible in creating multiple POS ??? or Can assign USER - SALE to a specific WAREHOUSE/POS 
            Sales Log
            <h1>REPORTS FOR A DAY AND A MONTH - SUMMARY</h1>
            <h1> Must be exportable and can be filter</h1>
            <h1> Sales Invoice</h1>
        </SalesLayout>
    );
};

export default Sales;
