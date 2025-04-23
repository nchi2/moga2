// app/api/messages/[id]/read/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth-options";
import db from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await db.message.update({
      where: { id: params.id },
      data: { status: "read" },
    });
    return NextResponse.json({ success: true, message: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update message status" },
      { status: 500 }
    );
  }
}
