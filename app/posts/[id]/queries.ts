import { unstable_cache as nextCache } from "next/cache";
import db from "@/lib/db";

/**
 * Retrieves a post by its ID with user and count information
 * @param {number} id - The ID of the post to retrieve
 * @returns {Promise<any>} The post data or null if not found
 */
async function getPost(id: number) {
    try {
        const post = await db.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        });
        return post;
    } catch {
        return null;
    }
}

/**
 * Cached version of getPost function
 */
export const getCachedPost = nextCache(getPost, ["post-detail"], {
    tags: ["post-detail"],
});

/**
 * Gets the like status for a post and user
 * @param {number} postId - The ID of the post
 * @param {number | undefined} userId - The ID of the user
 * @returns {Promise<{likeCount: number, isLiked: boolean}>}
 */
async function getLikeStatus(postId: number, userId: number | undefined) {
    if (!userId) return { likeCount: 0, isLiked: false };

    const isLiked = await db.like.findUnique({
        where: {
            id: {
                postId,
                userId,
            },
        },
    });
    const likeCount = await db.like.count({
        where: {
            postId,
        },
    });
    return {
        likeCount,
        isLiked: Boolean(isLiked),
    };
}

/**
 * Cached version of getLikeStatus function
 */
export function getCachedLikeStatus(postId: number, userId: number | undefined) {
    const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
        tags: [`like-status-${postId}`],
    });
    return cachedOperation(postId, userId);
} 