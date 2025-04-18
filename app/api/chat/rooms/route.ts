import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getChatRooms } from "@/app/(tabs)/chat/action";

export async function GET() {
    const session = await getSession();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await getChatRooms();
    return NextResponse.json(rooms);
} 