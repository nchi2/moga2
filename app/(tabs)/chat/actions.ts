'use server';

import { deleteChatRoom } from "./action";

export async function deleteChatRoomAction(chatRoomId: string): Promise<void> {
    await deleteChatRoom(chatRoomId);
} 