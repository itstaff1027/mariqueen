import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import LogisticsLayout from '@/Layouts/LogisticsLayout';

const Logistics = ({ sizes }) => {

    return (
        <LogisticsLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Logistics
                </h2>
            }
        >
            Logistics
            {/* Note: 
            * Filter Functionality
            * Export Functionality
            * Use Pagination
            * Update Order Numbet to add Tracking Number  */}
        </LogisticsLayout>
    );
};

export default Logistics;
