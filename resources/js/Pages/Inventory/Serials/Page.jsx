import React, { useEffect } from 'react';
import { Link, router } from "@inertiajs/react";
import InventoryLayout from '@/Layouts/InventoryLayout';
import Controller from '@/Components/UI/Pagination/Controller';
import { PlusIcon, PencilIcon, Trash2Icon, CheckIcon } from 'lucide-react';
import Table from '@/Components/UI/Tables';
import Buttons from '@/Components/UI/Buttons';
import Links from '@/Components/UI/Links';

export default function SerialNumber({ serial_number }) {
    useEffect(() => {
        console.log(serial_number);
    }, [serial_number]);

    return (
        <InventoryLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Serial Number
                    </h2>
                    <Link
                        href={route('serial_number.create')}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                    >
                        <PlusIcon size={16} />
                        Create Serial
                    </Link>
                </div>
            }
        >
            <div className="px-4 py-6">
                {serial_number.data.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <Table>
                            <Table.Head>
                                <Table.Row>
                                    <Table.Th>Batch #</Table.Th>
                                    <Table.Th>Product SKU</Table.Th>
                                    <Table.Th>Serial #</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Qty</Table.Th>
                                    <Table.Th>Warehouse</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Row>
                            </Table.Head>
                            <Table.Body>
                                {serial_number.data?.map((serial) => (
                                    <Table.Row key={serial.id}>
                                        <Table.Td>{serial.batch_id}</Table.Td>
                                        <Table.Td>{serial.product_variant_id}</Table.Td>
                                        <Table.Td>{serial.serial_number}</Table.Td>
                                        <Table.Td>{serial.status}</Table.Td>
                                        <Table.Td>{serial.quantity}</Table.Td>
                                        <Table.Td>{serial.warehouse.name}</Table.Td>
                                        <Table.Td className="space-x-2 px-4 py-3 text-sm">
                                            <Links.LinkIconAssign
                                                href={`/inventory/serial-number/${serial.id}/assign`}
                                                className="inline-flex items-center rounded-md bg-green-100 p-2 hover:bg-green-200"
                                                title="Assign"
                                            />
                                            <Links.LinkIconEdit 
                                                href={`/inventory/serial-number/${serial.id}/edit`}
                                                className="inline-flex items-center rounded-md bg-yellow-100 p-2 hover:bg-yellow-200"
                                                title="Edit"
                                            />
                                            <Buttons.IconDeleteButton
                                                onClick={(e) => {
                                                    e.prevenTable.Tdefault();
                                                    if (
                                                        confirm(
                                                            'Are you sure you want to delete this serial?',
                                                        )
                                                    ) {
                                                        router.delete(
                                                            `/inventory/serial-number/${serial.id}`,
                                                        );
                                                    }
                                                }}
                                                title="Delete"
                                            />
                                        </Table.Td>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <div className="p-4">
                            <Controller
                                value={serial_number}
                                preserveScrollBool
                                preserveStateBool
                            />
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-500">
                        No Serial Number found.
                    </div>
                )}
            </div>
        </InventoryLayout>
    );
}
