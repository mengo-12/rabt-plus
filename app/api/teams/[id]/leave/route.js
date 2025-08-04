import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamId = params.id;

    try {
        // حذف العضو من الفريق
        await prisma.teamMember.deleteMany({
            where: {
                teamId,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to leave team:', error);
        return NextResponse.json({ error: 'Failed to leave team' }, { status: 500 });
    }
}
