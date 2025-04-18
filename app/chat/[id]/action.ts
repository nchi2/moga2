"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getChatRoom(id: string) {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            error: "로그인이 필요합니다."
        };
    }

    const chatRoom = await db.chatRoom.findUnique({
        where: {
            id,
        },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });

    if (!chatRoom) {
        return {
            error: "채팅방을 찾을 수 없습니다."
        };
    }

    // 사용자가 채팅방에 속해있는지 확인
    const isParticipant = chatRoom.users.some(user => user.id === session.user!.id);
    if (!isParticipant) {
        return {
            error: "접근 권한이 없습니다."
        };
    }

    return {
        chatRoom: {
            id: chatRoom.id,
            users: chatRoom.users,
            messages: chatRoom.messages,
        },
        currentUser: session.user,
    };
}

export async function sendMessage(formData: FormData) {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            error: "로그인이 필요합니다."
        };
    }

    const chatRoomId = formData.get("chatRoomId");
    const content = formData.get("content");

    if (!chatRoomId || !content || content.toString().trim() === "") {
        return {
            error: "메시지 내용을 입력해주세요."
        };
    }

    // 트랜잭션으로 메시지 생성과 채팅방 업데이트를 함께 처리
    const [message] = await db.$transaction([
        db.message.create({
            data: {
                payload: content.toString(),
                chatRoomId: chatRoomId.toString(),
                userId: session.user!.id,
                status: "sent",
            },
        }),
        db.chatRoom.update({
            where: { id: chatRoomId.toString() },
            data: { updatedAt: new Date() },
        }),
    ]);

    revalidatePath(`/chat/${chatRoomId}`);
    revalidatePath("/chat"); // 채팅방 목록도 새로고침
    return { message };
} 