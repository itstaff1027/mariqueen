import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import AnalyticsLayout from '@/Layouts/AnalyticsLayout';

const Analytics = ({ }) => {

    return (
        <AnalyticsLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Analytics
                </h2>
            }
        >
            <div> Nothing to see here yet.</div>
        </AnalyticsLayout>
    );
};

export default Analytics;
