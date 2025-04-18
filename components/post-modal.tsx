"use client";

import { useRouter } from "next/navigation";
import PostForm from "./post-form";

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function PostModal({ isOpen, onClose, onSuccess }: PostModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-lg w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">새 글 작성</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <PostForm
                    onSuccess={() => {
                        onClose();
                        if (onSuccess) {
                            onSuccess();
                        } else {
                            router.refresh();
                        }
                    }}
                />
            </div>
        </div>
    );
} 