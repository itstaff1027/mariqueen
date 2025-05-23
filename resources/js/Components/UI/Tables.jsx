import React from 'react';
import { Link } from '@inertiajs/react';

const Table = ({
    table_styles = '',
    th_styles = '',
    td_styles = '',
    th_values = [],
    td_values = [],
    ...props
}) => {
    // if (!th_values.length || !td_values.length) return null;

    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg my-4" {...props}>
            <table className={`min-w-full divide-y divide-gray-200 ${table_styles}`}>
                {/* Sticky header with light gray bg */}
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {th_values.map((label, i) => (
                            <th
                                key={i}
                                scope="col"
                                className={`
                                    px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider
                                    ${th_styles}
                                `}
                            >
                                test
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {td_values.map((row, rowIdx) => (
                        <tr
                            key={rowIdx}
                            className={`
                                even:bg-gray-50 hover:bg-gray-100
                                cursor-default
                            `}
                        >
                            {row.map((cell, cellIdx) => (
                                <td
                                    key={cellIdx}
                                    className={`
                                        px-6 py-4 whitespace-nowrap text-sm text-gray-600
                                        ${td_styles}
                                    `}
                                >
                                    {/* If you pass in an object with { text, href }, it’ll render a link */}
                                    {cell.href ? (
                                        <Link
                                            href={cell.href}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {cell.text}
                                        </Link>
                                    ) : (
                                        cell
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
