import { NextRequest, NextResponse } from 'next/server';
import db from "@/lib/db";
import bcrypt from 'bcrypt';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 사용자 정보 조회 API
export async function GET() {
    try {
        // 세션 확인
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: '인증되지 않은 요청입니다.' },
                { status: 401 }
            );
        }

        // 사용자 정보 조회
        const user = await db.user.findUnique({
            where: { id: Number(session.user.id) },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('사용자 정보 조회 에러:', error);
        return NextResponse.json(
            { error: '사용자 정보 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 사용자 정보 업데이트 API
export async function PUT(request: NextRequest) {
    try {
        // 세션 확인
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: '인증되지 않은 요청입니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { username, avatar } = body;

        // 입력값 검증
        if (!username) {
            return NextResponse.json(
                { error: '사용자 이름은 필수입니다.' },
                { status: 400 }
            );
        }

        // 사용자 정보 업데이트
        const updatedUser = await db.user.update({
            where: { id: Number(session.user.id) },
            data: {
                username,
                avatar: avatar || undefined,
            },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                updatedAt: true,
            }
        });

        return NextResponse.json({
            message: '사용자 정보가 업데이트되었습니다.',
            user: updatedUser
        });
    } catch (error) {
        console.error('사용자 정보 업데이트 에러:', error);
        return NextResponse.json(
            { error: '사용자 정보 업데이트 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 비밀번호 변경 API
export async function PATCH(request: NextRequest) {
    try {
        // 세션 확인
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: '인증되지 않은 요청입니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        // 입력값 검증
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' },
                { status: 400 }
            );
        }

        // 사용자 정보 조회
        const user = await db.user.findUnique({
            where: { id: Number(session.user.id) },
            select: { id: true, password: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 현재 비밀번호 검증
        const isValidPassword = await bcrypt.compare(currentPassword, user.password || "");

        if (!isValidPassword) {
            return NextResponse.json(
                { error: '현재 비밀번호가 일치하지 않습니다.' },
                { status: 401 }
            );
        }

        // 새 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 비밀번호 업데이트
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({
            message: '비밀번호가 변경되었습니다.'
        });
    } catch (error) {
        console.error('비밀번호 변경 에러:', error);
        return NextResponse.json(
            { error: '비밀번호 변경 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 