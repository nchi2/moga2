import db from "@/lib/db";
import { getSession } from "@/lib/session";

export default async function authenticateUser(userId: string) {
  // 사용자 확인
  const user = await db.user.findUnique({
    where: { id: parseInt(userId) },
    select: { id: true, username: true },
  });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 세션 설정
  const session = await getSession();
  session.user = { id: user.id, username: user.username };
  await session.save();

  return user;
}
