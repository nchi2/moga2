declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: number;
        };
    }
}

export const sessionOptions = {
    cookieName: "session",
    password: process.env.SESSION_SECRET!,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    }
}; 