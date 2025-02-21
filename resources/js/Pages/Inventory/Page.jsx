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
        </InventoryLayout>
    );
};

export default Inventory;
