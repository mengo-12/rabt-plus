import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, rolesNeeded, invitedMembers } = await req.json();

    if (!name || !rolesNeeded || rolesNeeded.length === 0) {
        return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    try {
        // 1. إنشاء الفريق
        const team = await prisma.team.create({
            data: {
                name,
                description,
                rolesNeeded,
                ownerId: session.user.id,
            },
        });

        // 2. إضافة صاحب الفريق كعضو (مقبول تلقائيًا)
        await prisma.teamMember.create({
            data: {
                teamId: team.id,
                userId: session.user.id,
                role: 'owner',
                status: 'accepted',
            },
        });

        // 3. إرسال الدعوات للأعضاء المدعوين عبر الإشعارات
        for (const email of invitedMembers) {
            const user = await prisma.user.findUnique({ where: { email } });

            if (user) {
                // إضافة كعضو مع حالة "invited"
                await prisma.teamMember.create({
                    data: {
                        teamId: team.id,
                        userId: user.id,
                        role: 'member',
                        status: 'invited',
                    },
                });

                // إنشاء إشعار دعوة
                await prisma.notification.create({
                    data: {
                        userId: user.id,
                        title: `دعوة للانضمام إلى الفريق "${team.name}"`,
                        message: `${session.user.name} دعاك للانضمام إلى الفريق.`,
                        type: 'team_invitation',
                        data: {
                            teamId: team.id,
                            teamName: team.name,
                        },
                    },
                });
            }
        }

        return NextResponse.json({ message: 'Team created successfully', team });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
