"use client";

import Link from "next/link";
import { formatUsername } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ChatListProps, ChatRoom, MessagePayload, UnreadCounts } from "../types";

export default function ChatList({ initialRooms, initialUnreadCounts, session }: ChatListProps) {
    const [rooms, setRooms] = useState<ChatRoom[]>(initialRooms);
    const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>(initialUnreadCounts);

    useEffect(() => {
        // Supabase Realtime 구독 설정
        const channel = supabase.channel('chat_updates');

        channel
            .on('broadcast', { event: 'new_message' }, async ({ payload }: { payload: MessagePayload }) => {
                console.log('New message received in chat list:', payload);

                // 채팅방 목록 새로고침
                const response = await fetch('/api/chat/rooms');
                const updatedRooms = await response.json();
                setRooms(updatedRooms);

                // 읽지 않은 메시지 개수 업데이트
                if (payload.userId !== session?.user?.id) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [payload.id]: (prev[payload.id] || 0) + 1
                    }));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">채팅</h1>
            <div className="space-y-4">
                {rooms.map((room) => {
                    const otherUser = room.users.find(
                        (user) => user.id !== session?.user?.id
                    );
                    const lastMessage = room.messages[0];
                    const unreadCount = unreadCounts[room.id] || 0;

                    return (
                        <Link
                            key={room.id}
                            href={`/chat/${room.id}`}
                            className="block p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium">
                                            {formatUsername(otherUser?.username || "알 수 없는 사용자")}
                                        </p>
                                        {unreadCount > 0 && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-neutral-400">
                                        {lastMessage?.payload || "아직 메시지가 없습니다."}
                                    </p>
                                    {lastMessage && (
                                        <p className="text-xs text-neutral-500 mt-1">
                                            {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {rooms.length === 0 && (
                    <p className="text-center text-neutral-400">
                        아직 채팅방이 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
} 