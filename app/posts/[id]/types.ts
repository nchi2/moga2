export interface Comment {
    id: number;
    content: string;
    createdAt: Date;
    user: {
        username: string;
        avatar: string | null;
    };
} 