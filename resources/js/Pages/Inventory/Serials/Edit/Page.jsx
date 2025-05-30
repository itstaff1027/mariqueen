
import React, { useState, useEffect } from 'react';
import { Link, usePage, router, useForm } from "@inertiajs/react";
import InventoryLayout from '@/Layouts/InventoryLayout';
import Controller from '@/Components/UI/Pagination/Controller';
import Table from '@/Components/UI/Tables';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { Textarea } from '@headlessui/react';
const EditBatches = ({ batch, warehouses }) => {

    const { data, setData, success, put, errors, reset } = useForm({
        batch_id: batch.id,
        manufacturing_date: batch.manufacturing_date || '',
        expiry_date: batch.expiry_date || '',
        received_date: batch.received_date || '',
        description: batch.description || '',
        warehouse_id: batch.warehouse.id || '',
    });

    // useEffect(() => {
    //     console.log(warehouses);
    // }, [warehouses])


    const onSubmit = () => {
        // console.log(data);
        // // router.post(route('batches.store', data));
        put(`/inventory/batches/${batch.id}`);
    }

    return (
        <InventoryLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {batch.batch_number}
                </h2>
            }
        >
            <div className="grid grid-cols-2 gap-4" >
                <div>
                    <InputLabel
                        for="manufacturing_date"
                        value="Manufacturing Date"
                    />

                    <TextInput
                        type="date"
                        id="manufacturing_date"
                        name="manufacturing_date"
                        onChange={(e) => setData('manufacturing_date', e.target.value)}
                        value={data.manufacturing_date}
                        className="w-full border px-4 py-2"
                    />
                    <InputError message={errors.manufacturing_date} />
                </div>
                <div>
                    <InputLabel
                        for="expiry_date"
                        value="Expiration Date"
                    />

                    <TextInput
                        type="date"
                        id="expiry_date"
                        name="expiry_date"
                        value={data.expiry_date}
                        onChange={(e) => setData('expiry_date', e.target.value)}
                        className="w-full border px-4 py-2"
                    />
                    <InputError message={errors.expiry_date} />

                </div>
                <div>
                    <InputLabel
                        for="received_date"
                        value="Received Date"
                    />

                    <TextInput
                        type="date"
                        id="received_date"
                        name="received_date"
                        value={data.received_date}
                        onChange={(e) => setData('received_date', e.target.value)}
                        className="w-full border px-4 py-2"
                    />
                    <InputError message={errors.received_date} />

                </div>
                <div>
                    <InputLabel
                        for="warehouse_id"
                        value="Warehouses"
                    />
                    <select
                        className="w-full rounded-md border border-slate-300"
                        value={data.warehouse_id}
                        onChange={(e) => setData('warehouse_id', e.target.value)}
                    >
                        <option value="">Select a Warehouse</option>
                        {
                            warehouses?.map((wh, i) => (
                                <option key={i} value={wh.id}>{wh.name}</option>
                            ))
                        }
                    </select>
                    <InputError message={errors.warehouse_id} />

                </div>
            </div>
            <div className='w-full my-4'>
                <Textarea
                    value={data.description}
                    className={`w-full rounded-md border border-slate-300`}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} />
            </div>
            <div className='flex w-full justify-center items-center'>
                <button
                    className='bg-blue-500 p-2 text-white rounded-xl'
                    onClick={onSubmit}
                >
                    Update
                </button>
            </div>
        </InventoryLayout >
    );
};

export default EditBatches;
