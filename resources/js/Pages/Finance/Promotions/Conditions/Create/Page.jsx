import React, {useEffect, useState} from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

const CreatePromotionConditions = ({ initialData = {}, promotion, products, colors, heel_heights, categories, product_variants, promotion_conditions }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        ...initialData,
        conditions:
          initialData.conditions?.length > 0
            ? initialData.conditions
            : [{ type: '', id: '' }],
        discount_type: 'percentage',
        discount_value: '0',
        promotion_id: promotion.data.id
      })

      const { flash } = usePage().props;
      
    
      const typeOptions = [
        { value: 'product', label: 'Product' },
        { value: 'color', label: 'Color' },
        { value: 'heel_height', label: 'Heel Height' },
        { value: 'category', label: 'Category' },
        { value: 'variant', label: 'SKU / Variant' },
      ]
    
      // pick the right list based on type
      const optionsFor = (type) => {
        switch (type) {
          case 'product':
            return products.map((p) => ({ id: p.id, label: p.product_name }))
          case 'color':
            return colors.map((c) => ({ id: c.id, label: c.color_name }))
          case 'heel_height':
            return heel_heights.map((h) => ({ id: h.id, label: h.value }))
          case 'category':
            return categories.map((c) => ({ id: c.id, label: c.category_name }))
        //   case 'variant':
        //     return variants.map((v) => ({
        //       id: v.id,
        //       label: `${v.product_name} (${v.sku})`,
        //     }))
          default:
            return []
        }
      }
    
      const updateCondition = (idx, field, value) => {
        const arr = [...data.conditions]
        arr[idx][field] = value
        setData('conditions', arr)
      }
    
      const addCondition = () => {
        setData('conditions', [
          ...data.conditions,
          { type: '', id: '' },
        ])
      }
    
      const removeCondition = (idx) => {
        setData(
          'conditions',
          data.conditions.filter((_, i) => i !== idx)
        )
      }
    
      const handleSubmit = (e) => {
        e.preventDefault()
        console.log(data);
        post('/promotion_conditions', {
            onSuccess: () => {
                // flash('Promotion Conditions Created!')
            },
            onFinish: () => {
                reset()
            }
        })
      }

      const destroyCondition = (promotion_condition_id) => {
        if(confirm('Are you sure you want to delete this Condition?')){
            router.delete(`/promotion_conditions/${promotion_condition_id}`);
        }
      }

      useEffect(() => {
        console.log(promotion)
        console.log(promotion_conditions);
      }, [promotion])

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Promotion
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* ── your other promo fields here ──
                            <input
                              type="text"
                              name="promotion_name"
                              value={data.promotion_name}
                              onChange={(e) => setData('promotion_name', e.target.value)}
                              placeholder="Promo Name"
                            />
                            … */}
                            {
                                flash.success && (
                                    <div className="bg-green-500 text-white px-4 py-2 rounded-md mb-4">
                                        {flash.success}
                                    </div>
                                )
                            }

                                <div>
                                    <h3 className="mb-2 font-semibold">
                                        Promotion Conditions for -{' '}
                                        <u>{promotion?.data?.warehouse?.name}</u>
                                    </h3>
                                    <table className="w-full table-auto border-collapse rounded-xl border border-gray-300">
                                        <thead>
                                            <tr>
                                                <th>Condition Type</th>
                                                <th>Conditional Value</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.conditions.map(
                                                (cond, idx) => (
                                                    <tr
                                                        key={idx}
                                                        // className="mb-2 flex items-center space-x-2"
                                                    >
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {/* Type */}
                                                            <select
                                                                value={
                                                                    cond.type
                                                                }
                                                                onChange={(e) =>
                                                                    updateCondition(
                                                                        idx,
                                                                        'type',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="w-full rounded border border-slate-500/50 px-2 py-1"
                                                            >
                                                                <option value="">
                                                                    -- Select
                                                                    Type --
                                                                </option>
                                                                {typeOptions.map(
                                                                    (opt) => (
                                                                        <option
                                                                            key={
                                                                                opt.value
                                                                            }
                                                                            value={
                                                                                opt.value
                                                                            }
                                                                        >
                                                                            {
                                                                                opt.label
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </select>
                                                            <InputError message={errors[`conditions.${idx}.type`]} />
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {/* Value */}
                                                            {cond.type && (
                                                                <>
                                                                <select
                                                                    value={
                                                                        cond.id
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateCondition(
                                                                            idx,
                                                                            'id',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full rounded border border-slate-500/50 px-2 py-1"
                                                                >
                                                                    <option value="">
                                                                        --
                                                                        Select{' '}
                                                                        {
                                                                            cond.type
                                                                        }{' '}
                                                                        --
                                                                    </option>
                                                                    {optionsFor(
                                                                        cond.type,
                                                                    ).map(
                                                                        (
                                                                            opt,
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    opt.id
                                                                                }
                                                                                value={
                                                                                    opt.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    opt.label
                                                                                }
                                                                            </option>
                                                                        ),
                                                                    )}
                                                                </select>
                                                                <InputError message={errors[`conditions.${idx}.id`]} />
                                                                </>
                                                            )}
                                                        </td>

                                                        {/* Remove */}
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeCondition(
                                                                        idx,
                                                                    )
                                                                }
                                                                className="rounded-xl border border-red-500 p-2 px-2 text-red-600"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                    <InputError
                                        message={errors.conditions}
                                    />
                                    
                                    {/* Discount Type */}
                                    <div className="mt-4 grid w-full grid-cols-2 gap-2 justify-center items-center">
                                        {/* <div className="w-full">
                                            <InputLabel
                                                for="discount_type"
                                                value="Discount Type"
                                            />
                                            <select
                                                value={data.discount_type}
                                                name="discount_type"
                                                onChange={(e) =>
                                                    setData(
                                                        'discount_type',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-slate-500/50 px-2 py-1"
                                            >
                                                <option value="percentage">
                                                    Percentage (%)
                                                </option>
                                                <option value="fixed">
                                                    Fixed (₱)
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.discount_type}
                                            />
                                        </div>

                                        <div className="w-full">
                                            <InputLabel
                                                for="discount_value"
                                                value="Discount Value"
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                name="discount_value"
                                                value={data.discount_value}
                                                onChange={(e) =>
                                                    setData(
                                                        'discount_value',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Value"
                                                className="w-full rounded border border-slate-500/50 px-2 py-1"
                                            />
                                            <InputError
                                                message={errors.discount_value}
                                            />
                                        </div> */}
                                        <div className="w-full">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full rounded bg-green-600 px-4 py-2 text-white"
                                            >
                                                {processing
                                                    ? 'Saving…'
                                                    : 'Save Promotion'}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addCondition}
                                            className="text-blue-600 border px-4 py-2 rounded border-blue-600 hover:underline"
                                        >
                                            + Add Condition
                                        </button>
                                    </div>
                                </div>

                                
                            </form>


                            <div className="w-full">
                                <InputLabel 
                                
                                    value="Conditions"
                                />
                                <table className="w-full table-auto border-collapse rounded-xl border border-gray-300">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Condition</th>
                                            <th className="px-4 py-2">Value</th>
                                            <th className="px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            promotion_conditions.data?.map((condition, index) => (
                                                <tr key={index}>
                                                    <td className="border border-gray-300 px-4 py-2">{condition.conditional_type}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{condition.conditional_value?.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => destroyCondition(condition.id)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreatePromotionConditions;
