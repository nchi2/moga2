import { getChatRooms } from "./action";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { formatToTimeAgo } from "@/lib/utils";
import DeleteButton from "./components/delete-button";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";

export default async function ChatPage() {
    const session = await getSession();
    if (!session?.user?.id) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">로그인이 필요합니다.</p>
            </div>
        );
    }

    const userId = session.user.id;
    const chatRooms = await getChatRooms();

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {chatRooms.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">채팅방이 없습니다.</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {chatRooms.map((room) => {
                            // 상대방 정보 찾기
                            const otherUser = room.users.find(user => user.id !== userId);
                            const lastMessage = room.messages[0];

                            return (
                                <div key={room.id} className="relative">
                                    <Link href={`/chat/${room.id}`} className="block">
                                        <div className="p-4">
                                            <div className="flex items-start gap-4">
                                                {/* 최신 메시지 작성자의 아바타 */}
                                                <div className="w-12 h-12 relative overflow-hidden rounded-full bg-neutral-200">
                                                    {room.lastMessageUser?.avatar ? (
                                                        <Image
                                                            src={room.lastMessageUser.avatar}
                                                            alt={room.lastMessageUser.username}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <UserIcon className="w-full h-full p-2" />
                                                    )}
                                                </div>

                                                {/* 채팅방 정보 */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="font-medium truncate">
                                                            {otherUser?.username || "알 수 없는 사용자"}
                                                        </h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                {formatToTimeAgo(room.updatedAt.toString())}
                                                            </span>
                                                            <DeleteButton chatRoomId={room.id} />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {lastMessage?.payload || "메시지가 없습니다."}
                                                        </p>
                                                        {room?.unreadCount && room.unreadCount > 0 && (
                                                            <span className="ml-2 px-2 py-1 text-xs text-white bg-orange-500 rounded-full">
                                                                {room.unreadCount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}