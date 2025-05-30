import React from 'react';
import { CheckIcon, PencilIcon, RefreshCwIcon, SaveIcon as SaveIconLucide, Trash2Icon } from 'lucide-react';
import { Link } from '@inertiajs/react';

export const LinkCreate = (props) => {
    <Link
        {...props}
    >
        Create
    </Link>
}

export const LinkEdit = (props) => {
    <Link
        {...props}
        className="inline-flex items-center rounded-md bg-yellow-100 p-2 hover:bg-yellow-200"
    >
        Edit
    </Link>
}

export const LinkAssign = (props) => {
    <Link
        {...props}
        className="inline-flex items-center rounded-md bg-green-100 p-2 hover:bg-green-200"
    >
        Assign
    </Link>
}

export const LinkIconCreate = props => {
    return (
        <Link
            {...props}
        >
            <CirclePlus size={16} />
        </Link>
    )
}

export const LinkIconEdit = props => {
    return (
        <Link
            {...props}
            className="inline-flex items-center rounded-md bg-yellow-100 p-2 hover:bg-yellow-200"
        >
            <PencilIcon size={16} />
        </Link>
    );
}

export const LinkIconAssign = props => {
    return (
        <Link
            {...props}
            className="inline-flex items-center rounded-md bg-green-100 p-2 hover:bg-green-200"
        >
            <CheckIcon size={16} />
        </Link>
    )
}

const Links = {
    LinkCreate,
    LinkEdit,
    LinkAssign,
    LinkIconCreate,
    LinkIconEdit,
    LinkIconAssign
};

export default Links;