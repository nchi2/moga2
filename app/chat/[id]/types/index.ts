export interface Message {
    id: string;
    payload: string;
    createdAt: Date;
    user: {
        id: number;
        username: string;
        avatar: string | null;
    };
    status: string;
}

export interface ChatClientProps {
    chatRoom: {
        id: string;
        users: {
            id: number;
            username: string;
            avatar: string | null;
        }[];
        messages: Message[];
    };
    currentUser: {
        id: number;
        username?: string;
        email?: string;
        avatar?: string | null;
    };
} 