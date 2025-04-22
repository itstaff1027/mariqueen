import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import InventoryLayout from '@/Layouts/InventoryLayout';

const Inventory= ({ sizes }) => {

    return (
        <InventoryLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Inventory
                </h2>
            }
        >
            Inventory
            {/* <h1>Printable Square</h1> */}
            <h1>Printalbe/Exportable List of Sale a Day for a master list </h1>
            {/* <h1>Fix Square layouts add necessary details to complete the data, sf fee, rush fee, shoulder by, packaging type</h1> */}
            {/* <h1>MTO/pre order square style layout</h1>
            <h1>MTO/pre-order pages for Sales Order</h1> */}
        </InventoryLayout>
    );
};

export default Inventory;
