import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { formatUsername } from "@/lib/utils";

export default async function ChatLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { id: string };
}) {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user?.id) {
        redirect("/login");
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
        },
    });

    if (!chatRoom) {
        redirect("/");
    }

    const otherUser = chatRoom.users.find(user => user.id !== session.user!.id);

    return (
        <div className="flex flex-col h-screen">
            <div className="border-b border-neutral-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="relative size-10 overflow-hidden rounded-full">
                        {otherUser?.avatar ? (
                            <Image
                                src={otherUser.avatar}
                                alt={otherUser.username}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <UserIcon className="size-10" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-semibold">{formatUsername(otherUser?.username || "")}</h2>
                        <p className="text-sm text-neutral-400">채팅방 ID: {chatRoom.id}</p>
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
} 