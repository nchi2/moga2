"use server";

import db from "@/lib/db";

export async function getProduct(id: string) {
    try {
        const product = await db.product.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        return { success: true, data: product };
    } catch (error) {
        console.error("Error fetching product:", error);
        return { success: false, error: "Failed to fetch product" };
    }
} 