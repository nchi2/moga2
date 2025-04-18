"use server";

import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { Post } from "./components/life-client";

export async function getPosts(): Promise<Post[]> {
    // Disable caching to always fetch the latest data
    noStore();

    const posts = await db.post.findMany({
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
        orderBy: {
            createdAt: "desc",
        },
    });
    return posts;
}

export async function createPost(formData: FormData) {
    const session = await getSession();
    if (!session.user) {
        return { error: "로그인이 필요합니다." };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) {
        return { error: "제목과 내용을 모두 입력해주세요." };
    }

    try {
        const newPost = await db.post.create({
            data: {
                title,
                description,
                user: {
                    connect: {
                        id: session.user.id,
                    },
                },
            },
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

        revalidatePath("/life");
        return { success: "글이 작성되었습니다.", post: newPost };
    } catch {
        return { error: "글 작성에 실패했습니다." };
    }
} 