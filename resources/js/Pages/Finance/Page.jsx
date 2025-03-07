import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import FinanceLayout from '@/Layouts/FinanceLayout';

const Finance = ({ sizes }) => {

    return (
        <FinanceLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Finance
                </h2>
            }
        >
            Finance
        </FinanceLayout>
    );
};

export default Finance;
