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
        </SalesLayout>
    );
};

export default Sales;
