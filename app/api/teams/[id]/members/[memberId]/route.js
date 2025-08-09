import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: teamId, memberId } = params;

    try {
        // تحقق أن المستخدم هو مالك الفريق
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team || team.ownerId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized action' }, { status: 403 });
        }

        // حذف العضو من الفريق
        await prisma.teamMember.delete({
            where: {
                id: memberId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to remove member:', error);
        return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
    }
}
