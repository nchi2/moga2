import { getChatRoom } from "./action";
import { notFound } from "next/navigation";
import ChatClient from "./components/chat-client";

export default async function ChatPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;
    const result = await getChatRoom(id);

    if ("error" in result) {
        notFound();
    }

    const { chatRoom, currentUser } = result;

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <ChatClient
                chatRoom={chatRoom}
                currentUser={currentUser}
            />
        </div>
    );
}