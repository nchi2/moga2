"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatUsername } from "@/lib/utils";

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
        username: string;
        avatar: string;
    };
}

interface CommentSectionProps {
    postId: number;
    isLoggedIn: boolean;
}

export default function CommentSection({ postId, isLoggedIn }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/posts/${postId}/comments`);
                if (!response.ok) throw new Error("Failed to fetch comments");
                const data = await response.json();
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !isLoggedIn) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newComment.trim() }),
            });

            if (!response.ok) throw new Error("Failed to post comment");

            const newCommentData = await response.json();
            setComments((prev) => [newCommentData, ...prev]);
            setNewComment("");
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-black">댓글</h3>

            {isLoggedIn ? (
                <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !newComment.trim()}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "게시 중..." : "댓글 작성"}
                    </button>
                </form>
            ) : (
                <p className="text-gray-500 mb-6">댓글을 작성하려면 로그인이 필요합니다.</p>
            )}

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200">
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
                                <span className="font-semibold text-black">{formatUsername(comment.user.username)}</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mt-1 text-black">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 