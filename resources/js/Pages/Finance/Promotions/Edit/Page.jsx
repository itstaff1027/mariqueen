import React, {useEffect} from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const EditPromotion = ({ promotion, warehouses }) => {
    const { data, setData, put, errors } = useForm({
        promotion_name: promotion.data.name || '',
        type: promotion.data.type || '',
        discount_value: promotion.data.discount_value || '',
        starts_at: promotion.data.starts_at || '',
        ends_at: promotion.data.ends_at || '',
        promotion_from: promotion.data.promotion_from || '',
        is_active: promotion.data.is_active || '0'
    });

    const { flash } = usePage().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/promotions/${promotion.data.id}`);
    };

    useEffect(() => {
        console.log(promotion)
    }, [    ])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Promotion
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {
                                flash.success && <div className="my-4 bg-emerald-100 p-4 w-full border border-emerald-500 rounded-xl">
                                    <p className="text-emerald-600 text-sm">{flash.success}</p>
                                </div>
                            }

                            <form onSubmit={handleSubmit}>
                                {/* Name Input Field */}
                                <div className="mt-4 grid grid-cols-2 gap-4 sm:mt-0 sm:grid-cols-2">
                                    <div className="mb-6">
                                        <InputLabel
                                            for="promotion_name"
                                            value="Promotion's Name"
                                        />
                                        <TextInput
                                            id="promotion_name"
                                            name="promotion_name"
                                            value={data.promotion_name}
                                            onChange={(e) =>
                                                setData(
                                                    'promotion_name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <InputError
                                            message={errors.promotion_name}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <InputLabel
                                            for="type"
                                            value="Promotion's Type"
                                        />
                                        <select
                                            id="type"
                                            name="type"
                                            value={data.type}
                                            onChange={(e) =>
                                                setData('type', e.target.value)
                                            }
                                            className="w-full border border-slate-500/50 rounded-xl"
                                        >
                                            <option value="">
                                                Select Type
                                            </option>
                                            <option value="bundle">
                                                Bundle
                                            </option>
                                            <option value="discount">
                                                Discount
                                            </option>
                                        </select>
                                        <InputError message={errors.type} />
                                    </div>

                                    <div className="mb-6">
                                        <InputLabel
                                            for="discount_value"
                                            value="Discount's Value"
                                        />
                                        <TextInput
                                            id="discount_value"
                                            name="discount_value"
                                            value={data.discount_value}
                                            onChange={(e) =>
                                                setData(
                                                    'discount_value',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full"
                                        />
                                        <InputError
                                            message={errors.discount_value}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <InputLabel
                                            for="promotion_from"
                                            value="Discount For"
                                        />
                                        <select
                                            id="promotion_from"
                                            name="promotion_from"
                                            value={data.promotion_from}
                                            onChange={(e) =>
                                                setData(
                                                    'promotion_from',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-slate-500/50 rounded-xl"
                                        >
                                            <option value="">
                                                Select Team
                                            </option>
                                            {warehouses.map((wh, index) => (
                                                <option
                                                    key={index}
                                                    value={wh.id}
                                                >
                                                    {wh.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.promotion_from}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <InputLabel
                                            for="is_active"
                                            value="Discount's Status"
                                        />
                                        <select
                                            id="is_active"
                                            name="is_active"
                                            value={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    'is_active',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full border border-slate-500/50 rounded-xl"
                                        >
                                            <option value="0">In-Active</option>
                                            <option value="1">Active</option>
                                        </select>
                                        <InputError
                                            message={errors.is_active}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <InputLabel
                                            for="starts_at"
                                            value="Start Date"
                                        />
                                        <TextInput
                                            id="starts_at"
                                            name="starts_at"
                                            value={data.starts_at}
                                            onChange={(e) =>
                                                setData(
                                                    'starts_at',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full"
                                            type="date"
                                        />
                                        <InputError
                                            message={errors.starts_at}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <InputLabel
                                            for="ends_at"
                                            value="End Date"
                                        />
                                        <TextInput
                                            id="ends_at"
                                            name="ends_at"
                                            value={data.ends_at}
                                            onChange={(e) =>
                                                setData(
                                                    'ends_at',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full"
                                            type="date"
                                        />
                                        <InputError message={errors.ends_at} />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-emerald-700 focus:outline-none"
                                >
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditPromotion;
