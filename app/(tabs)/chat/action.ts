"use server";

import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// 타입 정의
interface User {
    id: number;
    username: string;
    avatar: string | null;
}

interface Message {
    id: string;
    payload: string;
    createdAt: Date;
    status: string;
    user?: User;
}

interface ChatRoom {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: number;
    users: User[];
    messages: Message[];
    unreadCount?: number;
    lastMessageUser?: User;
}

export async function getCurrentSession() {
    return await getSession();
}

export async function getChatRooms(): Promise<ChatRoom[]> {
    const session = await getSession();
    if (!session?.user?.id) return [];

    const userId = session.user.id;

    const rooms = await db.chatRoom.findMany({
        where: {
            users: {
                some: {
                    id: userId
                }
            }
        },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    avatar: true
                }
            },
            messages: {
                take: 1,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    // 각 채팅방의 읽지 않은 메시지 개수 계산
    const roomsWithUnreadCounts = await Promise.all(
        rooms.map(async (room) => {
            const unreadCount = await db.message.count({
                where: {
                    chatRoomId: room.id,
                    userId: { not: userId },
                    status: "sent"
                }
            });

            return {
                ...room,
                unreadCount,
                lastMessageUser: room.messages[0]?.user || null
            };
        })
    );

    return roomsWithUnreadCounts as ChatRoom[];
}

export async function getUnreadMessageCounts(roomIds: string[], userId: number): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    for (const roomId of roomIds) {
        const unreadMessages = await db.message.count({
            where: {
                chatRoomId: roomId,
                userId: { not: userId },
                status: "sent"
            }
        });
        counts[roomId] = unreadMessages;
    }

    return counts;
}

export async function deleteChatRoom(chatRoomId: string) {
    const session = await getSession();
    if (!session?.user?.id) {
        return {
            error: "로그인이 필요합니다."
        };
    }

    // 채팅방 참여자 확인
    const chatRoom = await db.chatRoom.findUnique({
        where: { id: chatRoomId },
        include: {
            users: {
                where: {
                    id: session.user.id
                }
            }
        }
    });

    if (!chatRoom) {
        return {
            error: "채팅방을 찾을 수 없습니다."
        };
    }

    if (chatRoom.users.length === 0) {
        return {
            error: "삭제 권한이 없습니다."
        };
    }

    // 채팅방과 관련된 모든 메시지 삭제
    await db.message.deleteMany({
        where: { chatRoomId }
    });

    // 채팅방 삭제
    await db.chatRoom.delete({
        where: { id: chatRoomId }
    });

    revalidatePath("/chat");
    return { success: true };
}

export async function revalidateChatList() {
    revalidatePath("/chat");
}

export async function getTotalUnreadMessages(): Promise<number> {
    const session = await getSession();
    if (!session?.user?.id) return 0;

    const userId = session.user.id;

    const totalUnread = await db.message.count({
        where: {
            userId: { not: userId },
            status: "sent",
            chatRoom: {
                users: {
                    some: {
                        id: userId
                    }
                }
            }
        }
    });

    return totalUnread;
} 