"use server";

import { productSchema } from "./zodSchema";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
export async function uploadProduct(formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            fieldErrors: {
                title: ["로그인이 필요합니다."]
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
    await db.product.create({
        data: {
            title: result.data.title,
            price: result.data.price,
            description: result.data.description,
            photo: typeof result.data.photo === 'string' ? result.data.photo : `/${result.data.photo.name}`,
            user: {
                connect: {
                    id: session.user.id
                }
            }
        },
    });
    revalidateTag("product-list");
    revalidateTag("xxxx");
    revalidateTag("product-detail");
    revalidateTag("product-title");

    redirect("/home");
}

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