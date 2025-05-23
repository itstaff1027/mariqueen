import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import InventoryLayout from '@/Layouts/InventoryLayout';
import Controller from '@/Components/UI/Pagination/Controller';
import Table from '@/Components/UI/Tables';

const CreateBatches = ({ }) => {

    useEffect(() => {
        // console.log(batches);
    }, [batches])

    return (
        <InventoryLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Batches
                </h2>
            }
        >
            <div>

            </div>
        </InventoryLayout>
    );
};

export default CreateBatches;
