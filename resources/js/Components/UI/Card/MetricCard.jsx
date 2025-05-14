// src/components/UI/MetricCard.jsx
import React from 'react';

const MetricCard = ({ title, value, trend }) => {
  const isUp = trend.type === 'up';

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col justify-between border-l-4 border-indigo-500 drop-shadow-md">
        {/* Title & Value */}
        <div>
            <span className="text-xs uppercase font-semibold text-gray-500">
                {title}
            </span>
            <h2 className={`mt-2 text-3xl font-extrabold text-gray-900`}>
                {value}
            </h2>
        </div>

        {/* Trend */}
        <div className="flex items-center">
            {
                trend && (
                    <>
                        {
                            trend.type && (
                                <>
                                    <span
                                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                            isUp ? 'bg-green-100' : 'bg-red-100'
                                        }`}
                                    >
                                        <span
                                            className={`text-sm font-bold ${
                                                isUp ? 'text-green-600' : 'text-red-600'
                                            }`}
                                        >
                                            {isUp ? '↑' : '↓'}
                                        </span>
                                    </span>
                                </>
                            )
                        }
                        {
                            trend.amount && <span
                                className={`ml-2 text-sm font-medium ${
                                    isUp ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {/* {isUp ? '+' : '-'} */}
                                {trend.amount}
                            </span>
                        }
                    </>
                )

            }
            
            
        </div>
    </div>
  );
};

export default MetricCard;
