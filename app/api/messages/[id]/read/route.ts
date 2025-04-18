import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const messageId = id;

        const updatedMessage = await db.message.update({
            where: { id: messageId },
            data: { status: "read" },
        });

        return NextResponse.json({ success: true, message: updatedMessage });
    } catch (error) {
        console.error('Error updating message status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update message status' },
            { status: 500 }
        );
    }
} 