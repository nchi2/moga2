"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic, startTransition } from "react";
import { dislikePost, likePost } from "@/app/posts/[id]/actions";

interface LikeButtonProps {
    isLiked: boolean;
    likeCount: number;
    postId: number;
}

export default function LikeButton({
    isLiked,
    likeCount,
    postId,
}: LikeButtonProps) {
    const [state, reducerFn] = useOptimistic(
        { isLiked, likeCount },
        (previousState) => ({
            isLiked: !previousState.isLiked,
            likeCount: previousState.isLiked
                ? previousState.likeCount - 1
                : previousState.likeCount + 1,
        })
    );
    const onClick = async () => {
        startTransition(() => {
            reducerFn(undefined);
        });

        const formData = new FormData();
        formData.append("postId", postId.toString());

        if (isLiked) {
            await dislikePost(formData);
        } else {
            await likePost(formData);
        }
    };
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 text-neutral-400 text-sm border border-neutral-400 rounded-full p-2  transition-colors ${state.isLiked
                ? "bg-blue-500 text-white border-blue-500"
                : "hover:bg-neutral-800"
                }`}
        >
            {state.isLiked ? (
                <HandThumbUpIcon className="size-5" />
            ) : (
                <OutlineHandThumbUpIcon className="size-5" />
            )}
            {state.isLiked ? (
                <span> {state.likeCount}</span>
            ) : (
                <span>공감하기 ({state.likeCount})</span>
            )}
        </button>
    );
}