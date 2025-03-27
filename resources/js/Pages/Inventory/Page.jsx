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
            <h1>Printable Square</h1>
            <h1>Printalbe/Exportable List of Sale a Day for a master list </h1>
        </InventoryLayout>
    );
};

export default Inventory;
