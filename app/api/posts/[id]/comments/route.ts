import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// GET /api/posts/[id]/comments - Get comments for a post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id: postId } = await params;
    const id = Number(postId);
    if (isNaN(id)) {
        return NextResponse.json(
            { error: "Invalid post ID" },
            { status: 400 }
        );
    }

    try {
        const comments = await db.comment.findMany({
            where: {
                postId: id,
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

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST /api/posts/[id]/comments - Create a new comment
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    console.log("POST request received for post comments");
    const session = await getSession();

    if (!session.user) {
        console.log("No user session found in post comments API");
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    const { id: postId } = await params;
    const id = Number(postId);

    if (isNaN(id)) {
        console.log("Invalid post ID");
        return NextResponse.json(
            { error: "Invalid post ID" },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();

        const { content } = body;
        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        console.log("Creating comment with data:", { content, postId: id, userId: session.user.id });
        const comment = await db.comment.create({
            data: {
                content,
                postId: id,
                userId: session.user.id,
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

        revalidatePath(`/posts/${id}`);
        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
} 