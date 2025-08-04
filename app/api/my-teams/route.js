// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';

// export async function GET() {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     try {
//         // جلب الفرق التي المستخدم عضو فيها والحالة "accepted"
//         const teams = await prisma.team.findMany({
//             where: {
//                 members: {
//                     some: {
//                         userId: session.user.id,
//                         status: 'accepted',
//                     },
//                 },
//             },
//             include: {
//                 members: {
//                     where: { status: 'accepted' },
//                     include: {
//                         user: { select: { id: true, name: true, avatar: true } },
//                     },
//                 },
//             },
//         });

//         return NextResponse.json({ teams });
//     } catch (error) {
//         console.error('Failed to fetch my teams:', error);
//         return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
//     }
// }


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        // 1. الفرق التي أملكها
        const ownedTeams = await prisma.team.findMany({
            where: { ownerId: userId },
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                members: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                    },
                },
            },
        });

        // 2. الفرق التي أنا عضو فيها (مقبول فقط)
        const memberTeams = await prisma.teamMember.findMany({
            where: { userId, status: 'accepted' },
            include: {
                team: {
                    include: {
                        owner: { select: { id: true, name: true, avatar: true } },
                        members: {
                            include: {
                                user: { select: { id: true, name: true, avatar: true } },
                            },
                        },
                    },
                },
            },
        });

        // استخراج الفريق من memberTeams
        const teamsFromMembership = memberTeams.map(member => member.team);

        // دمج الفرق بدون تكرار
        const teams = [...ownedTeams, ...teamsFromMembership.filter(t => !ownedTeams.some(o => o.id === t.id))];

        return NextResponse.json({ teams, currentUserId: userId });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
    }
}
