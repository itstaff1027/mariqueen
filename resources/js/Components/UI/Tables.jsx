import React from 'react';
import { Link } from '@inertiajs/react';

const Table = ({ children, className = '' }) => (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
    </div>
);

const TableHead = ({ children, className = '' }) => (
    <thead className={`bg-gray-50 sticky top-0 ${className}`}>{children}</thead>
);

const TableRow = ({ children, className = '', ...props }) => (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`} {...props}>{children}</tr>
);

const TableHeaderCell = ({ children, className = '', ...props }) => (
    <th
        scope="col"
        className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${className}`}
        {...props}
    >
        {children}
    </th>
);

const TableBody = ({ children, className = '' }) => (
    <tbody className={`divide-y divide-gray-100 ${className}`}>{children}</tbody>
);

const TableCell = ({ children, className = '', ...props }) => (
    <td
        scope="cell"
        className={`px-4 py-3 text-sm text-gray-800 ${className}`}
        {...props}
    >
        {children}
    </td>
);

// Attach subcomponents for easy import
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Th = TableHeaderCell;
Table.Td = TableCell;

export default Table;
