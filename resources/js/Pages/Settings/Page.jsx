import React, { useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import SettingsLayout from "@/Layouts/SettingsLayout";

const Settings= ({ sizes }) => {

    return (
        <SettingsLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Settings
                </h2>
            }
        >
            Settings
        </SettingsLayout>
    );
};

export default Settings;
