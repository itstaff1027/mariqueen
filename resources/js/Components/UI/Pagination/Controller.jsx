
import React from 'react';
import { router } from '@inertiajs/react';

const Controller = ({ value, preserveStateBool, preserveScrollBool }) => {
    // If there are no links, render nothing
    if (!value.links) {
        return null;
    }

    return (
        <div className="mt-4 flex justify-center">
            {value.links.map((link, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        if (link.url) {
                            router.visit(link.url, {
                                preserveState: preserveStateBool,
                                preserveScroll: preserveScrollBool,  // matches prop name
                            });
                        }
                    }}
                    className={`
            mx-1 px-3 py-1 border rounded
            ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}
          `}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
};

export default Controller;

