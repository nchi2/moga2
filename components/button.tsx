"use client"
import { useFormStatus } from "react-dom";

interface ButtonProps {
    title: string;
}

export default function Button({ title }: ButtonProps) {
    const { pending: loading } = useFormStatus();
    return (
        <button
            disabled={loading}
            className="primary-btn py-2 
            disabled:bg-neutral-400
            disabled:text-neutral-300
            disabled:cursor-not-allowed
            bg-blue-500
            hover:bg-pink-400
            active:bg-pink-600
            ">{loading ? "Loading..." : title}</button>
    )
}