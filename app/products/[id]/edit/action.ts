"use server";

import { productSchema } from "@/app/(tabs)/home/add/zodSchema";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidateTag } from "next/cache";

// 제품 정보를 가져오는 함수
export async function getProduct(id: string) {
    try {
        const product = await db.product.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                price: true,
                description: true,
                photo: true,
            }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

// 제품 정보를 업데이트하는 함수
export async function updateProduct(id: string, formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            fieldErrors: {
                title: ["로그인이 필요합니다."]
            }
        };
    }

    // 제품 소유자 확인
    const product = await db.product.findUnique({
        where: { id: Number(id) },
        select: { userId: true }
    });

    if (!product || product.userId !== session.user.id) {
        return {
            fieldErrors: {
                title: ["수정 권한이 없습니다."]
            }
        };
    }

    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description"),
    };

    const result = await productSchema.safeParse(data);
    if (!result.success) {
        return {
            fieldErrors: result.error.flatten().fieldErrors
        };
    }

    await db.product.update({
        where: { id: Number(id) },
        data: {
            title: result.data.title,
            price: result.data.price,
            description: result.data.description,
            photo: typeof result.data.photo === 'string' ? result.data.photo : `/${result.data.photo.name}`,
        },
    });

    // 캐시 갱신
    revalidateTag("product-detail");
    revalidateTag("product-title");
    revalidateTag("product-list");
    revalidateTag("xxxx");

    return { success: true };
}

// 이미지 업로드 URL 가져오기
export async function getUploadUrl() {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
        }
    });
    const data = await response.json();
    return data;
}