export interface User {
    id: number;
    username: string;
    avatar: string | null;
}

export interface Message {
    id: string;
    payload: string;
    createdAt: Date;
    status: string;
}

export interface MessagePayload {
    id: string;
    payload: string;
    createdAt: string;
    userId: number;
    username: string;
    avatar: string | null;
}

export interface ChatRoom {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    productId: number;
    users: User[];
    messages: Message[];
}

export interface UnreadCounts {
    [key: string]: number;
}

export interface Session {
    user?: {
        id: number;
        username: string;
        avatar?: string | null;
    };
}

export interface ChatListProps {
    initialRooms: ChatRoom[];
    initialUnreadCounts: UnreadCounts;
    session: Session;
} 