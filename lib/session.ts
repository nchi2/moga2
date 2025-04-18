"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    user?: {
        id: number;
        username: string;
        avatar?: string | null;
    };
}

const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "carrot-market-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionContent>(cookieStore, sessionOptions);
    return session;
}

export type { SessionContent };   