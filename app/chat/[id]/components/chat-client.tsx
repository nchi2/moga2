"use client";

/**
 * ChatClient Component
 * 
 * 실시간 채팅 클라이언트 컴포넌트입니다. Supabase Realtime을 사용하여 실시간 메시지 통신을 구현합니다.
 * 
 * 주요 기능:
 * 1. 실시간 메시지 송수신
 * 2. 메시지 읽음 상태 관리
 * 3. 사용자 presence 관리
 * 4. 자동 스크롤
 * 
 * 상태 관리:
 * - message: 현재 입력 중인 메시지
 * - messages: 채팅방의 모든 메시지 목록
 * - isConnected: Supabase 연결 상태
 * - error: 에러 메시지
 * 
 * Refs:
 * - messagesEndRef: 스크롤 위치 참조
 * - processedMessageIds: 처리된 메시지 ID 추적 (폴링 방지)
 * 
 * 최적화:
 * - useRef를 사용하여 처리된 메시지 상태를 추적하여 불필요한 폴링 방지
 * - 컴포넌트 마운트 시에만 메시지 상태 업데이트 수행
 * - 메시지 중복 처리 방지
 * 
 * Props:
 * @param {Object} chatRoom - 채팅방 정보 (id, messages, users)
 * @param {Object} currentUser - 현재 사용자 정보
 * 
 * 사용 예시:
 * ```tsx
 * <ChatClient 
 *   chatRoom={{ id: "1", messages: [], users: [] }}
 *   currentUser={{ id: "1", username: "user" }}
 * />
 * ```
 */

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { sendMessage } from "../action";
import { supabase } from "@/lib/supabase";
import { formatUsername, formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import { Message, ChatClientProps } from "../types";
import { revalidateChatList } from "@/app/(tabs)/chat/action";

export default function ChatClient({ chatRoom, currentUser }: ChatClientProps) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>(chatRoom.messages);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const processedMessageIds = useRef<Set<string>>(new Set());

    /**
     * 메시지 목록 초기화
     * 채팅방의 초기 메시지에 사용자 정보를 추가하여 상태를 설정합니다.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        console.log('Chat room users:', chatRoom.users);
        console.log('Initial messages:', chatRoom.messages);

        // 초기 메시지에 사용자 정보 추가
        const messagesWithUserInfo = chatRoom.messages.map(msg => {
            // 메시지 작성자 찾기
            const messageUser = chatRoom.users.find(user => user.id === msg.user.id);
            console.log('Message user:', msg.user.id, messageUser);

            return {
                ...msg,
                user: {
                    ...msg.user,
                    username: messageUser?.username || msg.user.username || "",
                    avatar: messageUser?.avatar || msg.user.avatar || null,
                }
            };
        });
        console.log('Initial messages with user info:', messagesWithUserInfo);
        setMessages(messagesWithUserInfo);
    }, [chatRoom.messages, chatRoom.users]);

    /**
     * 스크롤 자동 이동
     * 새 메시지가 추가될 때마다 스크롤을 최하단으로 이동합니다.
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /**
     * Supabase 실시간 구독 설정
     * 채팅방의 실시간 이벤트(새 메시지, 읽음 상태 변경 등)를 구독합니다.
     */
    useEffect(() => {
        console.log("Setting up Supabase Realtime subscription for chat room:", chatRoom.id);

        // 채널 생성
        const channel = supabase
            .channel(`chat_${chatRoom.id}`, {
                config: {
                    broadcast: { self: true },
                    presence: { key: currentUser.id.toString() },
                },
            })
            .on('presence', { event: 'sync' }, () => {
                console.log('Presence sync');
                setIsConnected(true);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('Presence join', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('Presence leave', key, leftPresences);
            })
            .on('broadcast', { event: 'new_message' }, ({ payload }) => {
                console.log('Received broadcast message:', payload);

                setMessages(prev => {
                    // 이미 동일한 ID의 메시지가 있는지 확인
                    if (prev.some(msg => msg.id === payload.id)) {
                        console.log('Message already exists, skipping:', payload.id);
                        return prev;
                    }

                    // 메시지 작성자 찾기
                    const messageUser = chatRoom.users.find(user => user.id === payload.userId);
                    console.log('Found message user:', messageUser);

                    // 새 메시지를 기존 메시지 목록에 추가
                    const newMessage = {
                        id: payload.id,
                        payload: payload.payload,
                        createdAt: new Date(payload.createdAt),
                        user: messageUser || {
                            id: payload.userId,
                            username: payload.username || "",
                            avatar: payload.avatar || null,
                        },
                        status: "sent",
                    };
                    console.log('Adding new message with user info:', newMessage);
                    return [...prev, newMessage];
                });
            })
            .on('broadcast', { event: 'message_read' }, ({ payload }) => {
                console.log('Message read event received:', payload);
                setMessages(prev => {
                    console.log('Previous messages in setMessages:', prev);
                    const updatedMessages = prev.map(msg =>
                        msg.id === payload.messageId ? { ...msg, status: "read" } : msg
                    );
                    console.log('Updated messages in setMessages:', updatedMessages);
                    return updatedMessages;
                });
            })
            .subscribe(async (status, err) => {
                console.log('Subscription status:', status);
                if (err) {
                    console.error('Subscription error:', err);
                    setError(err.message);
                    return;
                }
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true);
                    setError(null);
                    // 구독 후 현재 상태 동기화
                    await channel.track({ user_id: currentUser.id });
                }
            });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            console.log('Cleaning up subscription');
            supabase.removeChannel(channel);
            revalidateChatList();
        };
    }, [chatRoom.id, currentUser.id]);

    /**
     * 메시지 상태 업데이트
     * 읽지 않은 메시지의 상태를 '읽음'으로 업데이트합니다.
     * useRef를 사용하여 이미 처리된 메시지는 다시 처리하지 않도록 합니다.
     */
    useEffect(() => {
        const updateInitialMessageStatus = async () => {
            // 아직 읽지 않은 메시지만 필터링
            const unreadMessages = messages.filter(msg =>
                msg.user.id !== currentUser.id &&
                msg.status === "sent" &&
                !processedMessageIds.current.has(msg.id)
            );

            // 읽지 않은 메시지가 있을 때만 처리
            if (unreadMessages.length > 0) {
                console.log('Processing unread messages:', unreadMessages.length);
                for (const msg of unreadMessages) {
                    try {
                        // 이미 처리된 메시지인지 다시 한번 확인
                        if (processedMessageIds.current.has(msg.id)) {
                            console.log('Message already processed, skipping:', msg.id);
                            continue;
                        }

                        // 처리된 메시지로 표시
                        processedMessageIds.current.add(msg.id);
                        console.log('Marking message as processed:', msg.id);

                        // 최초 읽음 상태 업데이트를 위한 POST 요청
                        const response = await fetch(`/api/messages/${msg.id}/read`, { method: 'POST' });
                        const data = await response.json();
                        console.log('Initial message status update:', data);

                        // 읽음 상태 브로드캐스팅
                        const channel = supabase.channel(`chat_${chatRoom.id}`);
                        await channel.send({
                            type: 'broadcast',
                            event: 'message_read',
                            payload: { messageId: msg.id }
                        });
                    } catch (error) {
                        console.error('Error updating initial message status:', error);
                    }
                }
            }
        };
        updateInitialMessageStatus();
    }, [messages, chatRoom.id, currentUser.id]);

    /**
     * 메시지 전송 처리
     * 새 메시지를 서버에 전송하고 실시간으로 브로드캐스팅합니다.
     * @param {React.FormEvent<HTMLFormElement>} e - 폼 제출 이벤트
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            console.log('Sending message:', message);
            const formData = new FormData();
            formData.append("chatRoomId", chatRoom.id);
            formData.append("content", message);

            const result = await sendMessage(formData);
            console.log('Message send result:', result);

            if (result.error) {
                console.error('Error sending message:', result.error);
                setError(result.error);
                return;
            }

            // 새 메시지를 목록에 추가하지 않고 브로드캐스팅만 수행
            if (result.message) {
                // 브로드캐스팅으로 메시지 전송
                const channel = supabase.channel(`chat_${chatRoom.id}`);
                await channel.send({
                    type: 'broadcast',
                    event: 'new_message',
                    payload: {
                        id: result.message.id,
                        payload: result.message.payload,
                        createdAt: result.message.createdAt,
                        userId: currentUser.id,
                        username: currentUser.username,
                        avatar: currentUser.avatar || null,
                    }
                });
            }

            setMessage("");
            setError(null);
        } catch (error) {
            console.error('Error sending message:', error);
            setError('메시지 전송 중 오류가 발생했습니다.');
        }
    };

    console.log('isConnected', isConnected);

    return (
        <div className="flex flex-col h-full">
            {error && (
                <div className="bg-red-500 text-white p-2 text-center">
                    {error}
                </div>
            )}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 scrollbar-hide">
                {messages.map((msg, index) => (
                    <div
                        key={`${msg.id}-${index}`}
                        className={`flex items-start gap-2 ${msg.user.id === currentUser.id ? "justify-end" : ""}`}
                    >
                        {msg.user.id !== currentUser.id && (
                            <div className="w-10 h-10 mr-2 ml-2 p-5 relative overflow-hidden rounded-full">
                                {msg.user.avatar ? (
                                    <Image
                                        src={msg.user.avatar}
                                        alt={formatUsername(msg.user.username)}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <UserIcon className="size-8" />
                                )}
                            </div>
                        )}
                        <div className={`flex flex-col ${msg.user.id === currentUser.id ? "items-end" : ""}`}>
                            {msg.user.id === currentUser.id ? (
                                <div className="max-w-[100%] rounded-lg px-3 py-2 bg-blue-500 text-white">
                                    <p className="text-sm text-right break-words whitespace-normal">{msg.payload}</p>
                                    <p className="text-xs text-gray-300 mt-1 text-right">
                                        {msg.status === "read" ? "읽음" : "전송됨"}
                                    </p>
                                </div>
                            ) : (
                                <div className="max-w-[100%] rounded-lg px-3 py-2 bg-gray-100 text-black">
                                    <p className="text-sm break-words whitespace-normal">{msg.payload}</p>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {formatToTimeAgo(msg.createdAt.toString())}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 bg-neutral-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        전송
                    </button>
                </div>
            </form>
        </div>
    );
} 