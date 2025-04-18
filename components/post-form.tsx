"use client";

import { useFormStatus } from "react-dom";
import { createPost } from "@/app/(tabs)/life/action";
import { useState } from "react";

interface PostFormProps {
    onSuccess?: () => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
            {pending ? "작성 중..." : "작성하기"}
        </button>
    );
}

export default function PostForm({ onSuccess }: PostFormProps) {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(formData: FormData) {
        // Submit the form to the server
        const result = await createPost(formData);
        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else if (result.success) {
            setMessage({ type: "success", text: result.success });
            // Reset form
            const form = document.querySelector("form");
            if (form) form.reset();

            // Call onSuccess callback
            onSuccess?.();
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            <div>
                <input
                    type="text"
                    name="title"
                    placeholder="제목을 입력하세요"
                    className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white"
                    required
                />
            </div>
            <div>
                <textarea
                    name="description"
                    placeholder="내용을 입력하세요"
                    className="w-full px-4 py-2 rounded-md bg-neutral-800 text-white h-32"
                    required
                />
            </div>
            {message && (
                <div
                    className={`p-4 rounded-md ${message.type === "error" ? "bg-red-500" : "bg-green-500"
                        }`}
                >
                    {message.text}
                </div>
            )}
            <SubmitButton />
        </form>
    );
} 