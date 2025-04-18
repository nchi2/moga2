"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface CloseButtonProps {
    id: string;
}

export default function CloseButton({ id }: CloseButtonProps) {
    console.log("id", id);
    const router = useRouter();
    const onCloseClick = () => {
        router.back();
    };

    return (
        <button
            onClick={onCloseClick}
            className="text-neutral-500 hover:text-neutral-700 absolute top-0 right-0"
        >
            <ArrowLeftIcon className="w-6 border-2 border-white rounded-full text-white hover:text-white" />
        </button>
    );
} 