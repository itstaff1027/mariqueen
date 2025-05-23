
import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import InventoryLayout from '@/Layouts/InventoryLayout';
import Controller from '@/Components/UI/Pagination/Controller';
import Table from '@/Components/UI/Tables';

const Batches = ({ batches }) => {
    const [theadValues, setTHeadValues] = useState([

    ]);
    useEffect(() => {
        console.log(batches);
    }, [batches])

    return (
        <InventoryLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Batches
                </h2>
            }
        >
            <div>
                <div className="w-full flex justify-end items-end">
                    <Link
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                        href='/inventory/batches/create'
                    >
                        Crerate Batches
                    </Link>
                </div>
                <table className={`min-w-full divide-y divide-gray-200 text-center my-4`}>
                    <thead className="bg-gray-50">
                        <tr>
                            <th>Batch #</th>
                            <th>Manfu. Date</th>
                            <th>Exp. Date</th>
                            <th>Rec. Date</th>
                            <th>Warehouse</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            batches.data.map((batch, i) => (
                                <tr key={i}>
                                    <td>{batch.batch_number}</td>
                                    <td>{batch.manufacturing_date}</td>
                                    <td>{batch.expiry_date}</td>
                                    <td>{batch.received_date}</td>
                                    <td>{batch.warehouse.name}</td>
                                    <td>Buttons</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <Controller
                value={batches}
                preserveScrollBool={true}
                preserveStateBool={true}
            />
        </InventoryLayout>
    );
};

export default Batches;
