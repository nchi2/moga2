"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatUsername } from "@/lib/utils";

interface ProductComment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        username: string;
        avatar: string;
    };
}

interface ProductCommentSectionProps {
    productId: number;
    isLoggedIn: boolean;
}

export default function ProductCommentSection({ productId, isLoggedIn }: ProductCommentSectionProps) {
    const [comments, setComments] = useState<ProductComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/products/${productId}/comments`);
                if (!response.ok) throw new Error("Failed to fetch comments");
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !isLoggedIn) return;

        setIsLoading(true);
        try {
            console.log("Sending comment to API:", { content: newComment.trim(), productId });
            const response = await fetch(`/api/products/${productId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newComment.trim() }),
            });

            console.log("API response status:", response.status);
            const responseData = await response.json();
            console.log("API response data:", responseData);

            if (!response.ok) throw new Error("Failed to post comment");

            setComments((prev) => [responseData, ...prev]);
            setNewComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">상품 댓글</h3>

            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="mb-6">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="상품에 대한 댓글을 입력하세요..."
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-neutral-800 text-white border-neutral-700 placeholder-neutral-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !newComment.trim()}
                        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "게시 중..." : "댓글 작성"}
                    </button>
                </form>
            ) : (
                <p className="text-gray-500 mb-6">댓글을 작성하려면 로그인이 필요합니다.</p>
            )}

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <Image
                                src={comment.user.avatar}
                                alt={comment.user.username}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-white">{formatUsername(comment.user.username)}</span>
                                <span className="text-sm text-neutral-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mt-1 text-neutral-300">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 