import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { freelancerId, teamId } = await req.json();

    if (!freelancerId || !teamId) {
        return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    try {
        // تحقق من عدم وجود دعوة مكررة
        const existing = await prisma.teamMember.findFirst({
            where: { teamId, userId: freelancerId },
        });

        if (existing) {
            return NextResponse.json({ error: 'Already invited' }, { status: 400 });
        }

        // إضافة العضو كـ pending
        await prisma.teamMember.create({
            data: {
                teamId,
                userId: freelancerId,
                role: 'Member',
                status: 'pending',
            },
        });

        // إرسال إشعار للمستقل
        await prisma.notification.create({
            data: {
                userId: freelancerId,
                title: 'دعوة للانضمام إلى فريق',
                message: `تمت دعوتك للانضمام إلى فريق.`,
                type: 'team_invitation',
                data: { teamId },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to invite' }, { status: 500 });
    }
}
