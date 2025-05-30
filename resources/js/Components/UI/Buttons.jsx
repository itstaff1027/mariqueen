import React from 'react';
import { CheckIcon, PencilIcon, RefreshCwIcon, SaveIcon as SaveIconLucide, Trash2Icon } from 'lucide-react';

// Independent Text Buttons
export const SubmitButton = (props) => (
    <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
    >
        Submit
    </button>
);

export const EditButton = (props) => (
    <button
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        {...props}
    >
        Edit
    </button>
);

export const UpdateButton = (props) => (
    <button
        className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        {...props}
    >
        Update
    </button>
);

export const SaveButton = (props) => (
    <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...props}
    >
        Save
    </button>
);

export const DeleteButton = (props) => (
    <button
        className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        {...props}
    >
        Delete
    </button>
);

// Independent Icon Buttons
export const IconSubmitButton = (props) => (
    <button
        className="p-2 bg-blue-600 text-white rounded-full transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
    >
        <CheckIcon size={16} />
    </button>
);

export const IconEditButton = (props) => (
    <button
        className="p-2 bg-gray-200 text-gray-800 rounded-full transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        {...props}
    >
        <PencilIcon size={16} />
    </button>
);

export const IconUpdateButton = (props) => (
    <button
        className="p-2 bg-green-600 text-white rounded-full transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        {...props}
    >
        <RefreshCwIcon size={16} />
    </button>
);

export const IconSaveButton = (props) => (
    <button
        className="p-2 bg-indigo-600 text-white rounded-full transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...props}
    >
        <SaveIconLucide size={16} />
    </button>
);

export const IconDeleteButton = (props) => (
    <button
        className="p-2 bg-red-600 text-white rounded-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        {...props}
    >
        <Trash2Icon size={16} />
    </button>
);

// Default export for legacy compatibility
const Buttons = {
    SubmitButton,
    EditButton,
    UpdateButton,
    SaveButton,
    DeleteButton,
    IconSubmitButton,
    IconEditButton,
    IconUpdateButton,
    IconSaveButton,
    IconDeleteButton,
};

export default Buttons;
