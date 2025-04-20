import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import db from "@/lib/db";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
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
      where: { id: context.params.id },
      data: { status: "read" },
    });

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error("Error updating message status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update message status" },
      { status: 500 }
    );
  }
}
