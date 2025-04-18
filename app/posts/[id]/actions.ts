"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { Comment } from "./types";

/**
 * Increments the view count for a specific post
 * @param {number} id - The ID of the post to increment views for
 * @returns {Promise<void>}
 */
export async function incrementViews(id: number) {
    await db.post.update({
        where: { id },
        data: { views: { increment: 1 } },
    });
    revalidatePath(`/posts/${id}`);
}

/**
 * Adds a like to a post for the current user
 * @param {FormData} formData - Form data containing the postId
 * @throws {Error} If user is not logged in
 * @returns {Promise<void>}
 */
export async function likePost(formData: FormData) {
    const postId = Number(formData.get("postId"));
    const session = await getSession();
    if (!session?.user?.id) {
        throw new Error("로그인이 필요합니다.");
    }
    const userId = session.user.id;
    try {
        await db.like.create({
            data: {
                postId,
                userId,
            },
        });
        revalidatePath(`/posts/${postId}`);
    } catch {
        // Error handling if needed
    }
}

/**
 * Removes a like from a post for the current user
 * @param {FormData} formData - Form data containing the postId
 * @throws {Error} If user is not logged in
 * @returns {Promise<void>}
 */
export async function dislikePost(formData: FormData) {
    const postId = Number(formData.get("postId"));
    const session = await getSession();
    if (!session?.user?.id) {
        throw new Error("로그인이 필요합니다.");
    }
    const userId = session.user.id;
    try {
        await db.like.delete({
            where: {
                id: {
                    postId,
                    userId,
                },
            },
        });
        revalidatePath(`/posts/${postId}`);
    } catch {
        // Error handling if needed
    }
}

/**
 * Retrieves all comments for a specific post
 * @param {number} postId - The ID of the post to get comments for
 * @returns {Promise<Comment[]>} Array of comments with user information
 * @throws {Error} If comments cannot be fetched
 */
export async function getComments(postId: number): Promise<Comment[]> {
    noStore();

    try {
        const comments = await db.comment.findMany({
            where: {
                postId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return comments;
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        throw new Error("Failed to fetch comments");
    }
}

/**
 * Creates a new comment on a post
 * @param {number} postId - The ID of the post to comment on
 * @param {string} content - The content of the comment
 * @returns {Promise<Comment>} The newly created comment with user information
 * @throws {Error} If user is not authenticated, content is invalid, or post doesn't exist
 */
export async function createComment(postId: number, content: string): Promise<Comment> {
    try {
        const session = await getSession();
        if (!session?.user) {
            throw new Error("Authentication required");
        }

        if (!content || typeof content !== "string" || content.trim().length === 0) {
            throw new Error("Comment content is required");
        }

        // Check if post exists
        const post = await db.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const comment = await db.comment.create({
            data: {
                content: content.trim(),
                userId: session.user.id,
                postId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true,
                    },
                },
            },
        });

        revalidatePath(`/posts/${postId}`);
        return comment;
    } catch (error) {
        console.error("Failed to create comment:", error);
        throw error;
    }
} 