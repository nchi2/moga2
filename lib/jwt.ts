import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JWTPayload {
    id: number;
    username?: string;
    email?: string;
    phone?: string;
}

export function signToken(payload: JWTPayload) {
    if (!payload) throw new Error("Payload is required");
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        console.error(error);
        return null;
    }
} 