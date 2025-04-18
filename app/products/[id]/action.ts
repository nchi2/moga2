"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

/**
 * Checks if the user is logged in and returns the session
 * @returns {Promise<{error?: string, session?: any}>} Session information or error
 */
async function checkSession() {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            error: "로그인이 필요합니다.",
            session: null,
        };
    }
    return { session };
}

/**
 * Retrieves a product by its ID
 * @param {number} id - The ID of the product to retrieve
 * @returns {Promise<{error?: string, product?: any}>} Product information or error
 */
async function getProductById(id: number) {
    const product = await db.product.findUnique({
        where: {
            id,
        },
        select: {
            userId: true,
        },
    });

    if (!product) {
        return {
            error: "상품을 찾을 수 없습니다.",
            product: null,
        };
    }

    return { product };
}

/**
 * Checks if the current user is the owner of a product
 * @param {number} userId - The ID of the product owner
 * @returns {Promise<boolean>} True if the current user is the owner, false otherwise
 */
export async function getIsOwner(userId: number) {
    const { session } = await checkSession();
    if (!session) return false;

    return session.user!.id === userId;
}

/**
 * Retrieves a product by its ID with user information
 * @param {number} id - The ID of the product to retrieve
 * @returns {Promise<any>} The product data or null if not found
 */
export async function getProduct(id: number) {
    const product = await db.product.findUnique({
        where: {
            id,
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
    return product;
}

/**
 * Deletes a product if the current user is the owner
 * @param {number} id - The ID of the product to delete
 * @returns {Promise<{error?: string, success?: boolean}>} Success or error information
 */
export async function deleteProduct(id: number) {
    const { session, error } = await checkSession();
    if (error) return { error };

    const { product, error: productError } = await getProductById(id);
    if (productError) return { error: productError };

    if (product!.userId !== session!.user!.id) {
        return {
            error: "권한이 없습니다.",
        };
    }

    await db.product.delete({
        where: {
            id,
        },
    });

    revalidatePath("/");
    return {
        success: true,
    };
}

/**
 * Creates a chat room for a product or returns an existing one
 * @param {string} productId - The ID of the product as a string
 * @returns {Promise<{error?: string, roomId?: number}>} Chat room ID or error
 */
export async function createChatRoom(productId: string) {
    const { session, error } = await checkSession();
    if (error) return { error };

    const { product, error: productError } = await getProductById(Number(productId));
    if (productError) return { error: productError };

    // 이미 존재하는 채팅방이 있는지 확인
    const existingRoom = await db.chatRoom.findFirst({
        where: {
            AND: [
                {
                    users: {
                        some: {
                            id: product!.userId,
                        },
                    },
                },
                {
                    users: {
                        some: {
                            id: session!.user!.id,
                        },
                    },
                },
                {
                    productId: Number(productId),
                },
            ],
        },
    });

    if (existingRoom) {
        return {
            roomId: existingRoom.id,
        };
    }

    // 새로운 채팅방 생성
    const room = await db.chatRoom.create({
        data: {
            users: {
                connect: [
                    {
                        id: product!.userId,
                    },
                    {
                        id: session!.user!.id,
                    },
                ],
            },
            productId: Number(productId),
        },
    });

    return {
        roomId: room.id,
    };
} 