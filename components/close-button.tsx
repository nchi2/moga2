"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";

interface CloseButtonProps {
    id: string;
}

export default function CloseButton({ id }: CloseButtonProps) {
    const onCloseClick = () => {
        window.location.href = `/products/${id}`;
    };

    return (
        <button
            onClick={onCloseClick}
            className="text-neutral-500 hover:text-neutral-700 absolute top-0 right-0"
        >
            <XMarkIcon className="w-6 border-2 border-white rounded-full text-white hover:text-white" />
        </button>
    );
} 