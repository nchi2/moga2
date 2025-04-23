import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth-options";
import db from "@/lib/db";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await db.message.update({
      where: { id, userId: parseInt(session.user.id) },
      data: { status: "read" },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "메시지 상태 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}
