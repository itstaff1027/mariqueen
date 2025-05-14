import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import AnalyticsLayout from "@/Layouts/AnalyticsLayout";
import MetricCard from '@/Components/UI/Card/MetricCard';
import RevenueBarChart from '@/Components/UI/Chart/RevenueChart';
import ChartJsPieChart from '@/Components/UI/Chart/PieChart';
import { Popover } from '@headlessui/react'
import { DateRangePicker, DefinedRange } from 'react-date-range'
import { CalendarDays as CalendarIcon } from 'lucide-react'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';

const SalesDashboard = ({ 
    range, 
    sales_current, 
    sales_previous, 
    trend, 
    monthly_sales, 
    yearly_sales, 
    daily_sales, 
    top_ten_customers, 
    only_view, 
    top_ten_products,
    top_agents
}) => {
    // src/data/sampleAnalytics.js
    const [revenueTrend, setRevenueTrend] = useState({ type: '', amount: ''});
    const sampleData = [
        { name: 'Jan', uv:  5000, pv: 7200, amt: 2400 },
        { name: 'Feb', uv:  6100, pv: 6300, amt: 2210 },
        { name: 'Mar', uv:  7200, pv: 5400, amt: 2290 },
        { name: 'Apr', uv:  8100, pv: 6100, amt: 2000 },
        { name: 'May', uv:  9200, pv: 7000, amt: 2181 },
        { name: 'Jun', uv:  8300, pv: 7800, amt: 2500 },
        { name: 'Jul', uv:  7400, pv: 6900, amt: 2100 },
        { name: 'Aug', uv:  8500, pv: 7200, amt: 2400 },
        { name: 'Sep', uv:  9600, pv: 8000, amt: 2600 },
        { name: 'Oct', uv: 10400, pv: 8600, amt: 2700 },
        { name: 'Nov', uv: 11500, pv: 9200, amt: 2900 },
        { name: 'Dec', uv: 12600, pv:10000, amt: 3100 },
    ];

    const [selection, setSelection] = useState([{
        startDate: new Date(range.from),
        endDate: new Date(range.to),
        key: 'selection',
    }]);

    const applyFilter = () => {
        router.get(route('sales_analytics_dashboard'), {
            start_date: format(selection[0].startDate, 'yyyy-MM-dd'),
            end_date: format(selection[0].endDate, 'yyyy-MM-dd'),
        }, { preserveState: true, });
    };


    useEffect(() => {
        // console.log(range);
        // console.log(sales_current)
        // console.log(sales_previous)
        // console.log(selection);
        console.log(top_ten_customers)
        console.log(top_ten_products)
        console.log(top_agents)
        // console.log(new Date('YYYY-MM-DD'))
        // console.log(monthly_sales.map(item => parseFloat(item.total_excess) + parseFloat(item.total_rush_fee) + parseFloat(item.total_shipping_fee) + parseFloat(item.total_revenue)))
    }, [range])
  
    return (
        <AnalyticsLayout>
            <div className="mb-4">
                <h1 className="text-2xl">
                    Highlights - Metric Card basis are only dailies{' '}
                </h1>
            </div>

            <Popover className="relative grid grid-cols-3 gap-4 mb-4">
                {({ open }) => (
                    <>
                        {/* Toggle Button */}
                        <Popover.Button
                            className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${open ? 'ring-2 ring-blue-400' : 'border-gray-300'} bg-white transition hover:shadow-md`}
                        >
                            <CalendarIcon className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">
                                {selection[0].startDate.toLocaleDateString()} –{' '}
                                {selection[0].endDate.toLocaleDateString()}
                            </span>
                        </Popover.Button>

                        {/* Popover Panel */}
                        <Popover.Panel className="absolute z-10 mt-2 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Quick Presets */}
                                {/* <DefinedRange
                                    onChange={item => setSelection([ item.selection ])}
                                    ranges={selection}
                                    staticRanges={[]}
                                    inputRanges={[]}
                                    className="mr-4"
                                /> */}

                                {/* Full Calendar */}
                                <DateRangePicker
                                    ranges={selection}
                                    onChange={(item) =>
                                        setSelection([item.selection])
                                    }
                                    showSelectionPreview={true}
                                    moveRangeOnFirstSelection={false}
                                    direction="vertical"
                                    months={1}
                                />
                            </div>
                        </Popover.Panel>
                        <button
                            onClick={applyFilter}
                            className="mt-3 rounded bg-blue-600 px-4 py-2 text-white"
                        >
                            Apply
                        </button>
                    </>
                )}
            </Popover>

            <div className="grid grid-cols-4 gap-4">
                <MetricCard
                    title={'Total Revenue (U.P. x QTY)'}
                    value={sales_current.data.total_revenue}
                    trend={{ type: trend.type, amount: trend.percent + '%' }}
                />
                <MetricCard
                    title={'Total Shipping Fee'}
                    value={sales_current.data.total_shipping_fee}
                    trend={{ type: trend.type, amount: trend.percent + '%' }}
                />
                <MetricCard
                    title={'Total Rush Fee'}
                    value={sales_current.data.total_rush_fee}
                    trend={{ type: trend.type, amount: trend.percent + '%' }}
                />
                <MetricCard
                    title={'Total Excess'}
                    value={sales_current.data.total_excess}
                    trend={{ type: trend.type, amount: trend.percent + '%' }}
                />
                <MetricCard
                    title={'Total Revenue ((U.P x QTY ) - Balances)'}
                    value={sales_current.data.total_revenue - (- sales_current.data.total_balance)}
                    trend={{}}
                />
                <MetricCard
                    title={'Total Balance'}
                    value={sales_current.data.total_balance}
                    trend={{}}
                />
            </div>
            <div className="flex my-4">
                <RevenueBarChart 
                    title={'Daily'}
                    chartDataLabel={'Total Revenue (TR+SF+RF+EXC)'}    
                    labels={daily_sales.map((item) => item.date)}
                    dataValues={
                        daily_sales.map(item => 
                            parseFloat(item.total_excess) + 
                            parseFloat(item.total_rush_fee) + 
                            parseFloat(item.total_shipping_fee) + 
                            parseFloat(item.total_revenue)
                        )
                    }
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <RevenueBarChart 
                    title={'Monthly'}
                    chartDataLabel={'Total Revenue (TR+SF+RF+EXC)'}    
                    labels={monthly_sales.map((item) => item.month)}
                    dataValues={
                        monthly_sales.map(item => 
                            parseFloat(item.total_excess) + 
                            parseFloat(item.total_rush_fee) + 
                            parseFloat(item.total_shipping_fee) + 
                            parseFloat(item.total_revenue)
                        )
                    }
                />
                
                <RevenueBarChart 
                    title={'Yearly'}
                    chartDataLabel={'Total Revenue (TR+SF+RF+EXC)'}    
                    labels={yearly_sales.map((item) => item.year)}
                    dataValues={
                        yearly_sales.map(item => 
                            parseFloat(item.total_excess) + 
                            parseFloat(item.total_rush_fee) + 
                            parseFloat(item.total_shipping_fee) + 
                            parseFloat(item.total_revenue)
                        )
                    }
                />
                <ChartJsPieChart 
                    title={'Top 10 Customers'}
                    labels={top_ten_customers.map((item) => item.customers.first_name + ' ' + item.customers.last_name)}
                    pieValue={top_ten_customers.map((item) => item.total_purchases)}
                />
                {only_view && (
                    <>
                        <ChartJsPieChart 
                            title={'Top Agent'}
                            labels={top_agents.map((item) => item.user.name)}
                            pieValue={top_agents.map((item) => item.total_sales)}
                        />
                        <ChartJsPieChart 
                            title={'Top 10 Products'} 
                            labels={top_ten_products.map((item) => item.product_variant.product.product_name)}
                            pieValue={top_ten_products.map((item) => item.total_quantity)}
                        />
                    </>
                )}
            </div>
        </AnalyticsLayout>
    );
}

export default SalesDashboard;