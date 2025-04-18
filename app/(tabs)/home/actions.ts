"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            createdAt: true,
            photo: true,
            id: true,
        },
        skip: page * 5,
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}

export async function getProducts() {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            createdAt: true,
            photo: true,
            id: true
        },
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
    });
    return products;
}