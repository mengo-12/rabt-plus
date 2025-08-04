import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId, response } = await req.json();

    if (!['accepted', 'rejected'].includes(response)) {
        return NextResponse.json({ error: "Invalid response" }, { status: 400 });
    }

    try {
        // جلب الإشعار للحصول على بيانات teamId و memberId
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification || !notification.data || !notification.data.teamId || !notification.data.memberId) {
            return NextResponse.json({ error: "Notification data missing" }, { status: 404 });
        }

        const { teamId, memberId } = notification.data;

        // تحديث حالة العضو في الفريق
        await prisma.teamMember.update({
            where: { id: memberId },
            data: { status: response },
        });

        // جعل الإشعار كمقروء
        await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        // إرسال إشعار لصاحب الفريق (بأن العضو قبل أو رفض)
        const team = await prisma.team.findUnique({ where: { id: teamId } });

        await prisma.notification.create({
            data: {
                userId: team.ownerId,
                title: `رد على دعوة الفريق`,
                message: `${session.user.name} قام بـ ${response === 'accepted' ? 'قبول' : 'رفض'} الدعوة لفريق ${team.name}`,
                type: 'team_invitation',
                data: { teamId, memberId },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to respond to invitation" }, { status: 500 });
    }
}
