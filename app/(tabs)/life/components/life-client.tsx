"use client";

import { formatToTimeAgo } from "@/lib/utils";
import {
    ChatBubbleBottomCenterIcon,
    HandThumbUpIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PostModal from "@/components/post-modal";

export interface Post {
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    views: number;
    _count: {
        likes: number;
        comments: number;
    };
}

export default function LifeClient() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Function to fetch the latest posts
    const fetchLatestPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/posts');
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch posts on component mount
    useEffect(() => {
        fetchLatestPosts();
    }, []);

    // Handle successful post creation
    const handlePostCreated = () => {
        // Close the modal
        setIsModalOpen(false);
        // Refresh the page to show the new post
        router.refresh();
        // Also fetch the latest posts
        fetchLatestPosts();
    };

    return (
        <div className="p-5 flex flex-col">
            {loading ? (
                <div className="text-center py-10">Loading posts...</div>
            ) : (
                posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/posts/${post.id}`}
                        className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col gap-2 last:pb-0 last:border-b-0"
                    >
                        <h2 className="text-white text-lg font-semibold">{post.title}</h2>
                        <p>{post.description}</p>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex gap-4 items-center">
                                <span>{formatToTimeAgo(post.createdAt.toString())}</span>
                                <span>·</span>
                                <span>조회 {post.views}</span>
                            </div>
                            <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
                                <span>
                                    <HandThumbUpIcon className="size-4" />
                                    {post._count.likes}
                                </span>
                                <span>
                                    <ChatBubbleBottomCenterIcon className="size-4" />
                                    {post._count.comments}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 text-white flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 transition-colors hover:bg-green-600"
            >
                <PlusIcon className="size-10" />
            </button>

            {/* Post Modal */}
            <PostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handlePostCreated}
            />
        </div>
    );
} 