// app/api/messages/[id]/read/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import db from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const updatedMessage = await db.message.update({
      where: {
        id: params.id,
        userId: parseInt(session.user.id),
      },
      data: {
        status: "read",
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error updating message status:", error);
    return NextResponse.json(
      { error: "메시지 상태 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}
