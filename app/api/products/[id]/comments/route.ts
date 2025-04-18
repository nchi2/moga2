import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import db from "@/lib/db";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id: productId } = await params;
    const id = Number(productId);
    if (isNaN(id)) {
        return NextResponse.json(
            { error: "Invalid product ID" },
            { status: 400 }
        );
    }

    try {
        const comments = await db.productComment.findMany({
            where: {
                productId: id,
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

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSession();

    if (!session.user) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
    }

    const { id: productId } = await params;
    const id = Number(productId);

    if (isNaN(id)) {
        return NextResponse.json(
            { error: "Invalid product ID" },
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

        const comment = await db.productComment.create({
            data: {
                content,
                productId: id,
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

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
} 