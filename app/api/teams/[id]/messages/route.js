// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';




// export async function GET(req, { params }) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id: teamId } = params;

//     try {
//         // جلب جميع الرسائل الخاصة بالفريق
//         const messages = await prisma.teamMessage.findMany({
//             where: { teamId },
//             include: {
//                 sender: {
//                     select: { id: true, name: true, avatar: true },
//                 },
//             },
//             orderBy: { createdAt: 'asc' },
//         });

//         return NextResponse.json({ messages });
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//         return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
//     }
// }



// export async function POST(req, { params }) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id: teamId } = params;
//     const { content } = await req.json();

//     if (!content || content.trim() === '') {
//         return NextResponse.json({ error: 'Empty message' }, { status: 400 });
//     }

//     try {
//         // تحقق إذا كان المستخدم عضوًا في الفريق
//         const member = await prisma.teamMember.findFirst({
//             where: {
//                 teamId,
//                 userId: session.user.id,
//                 status: 'accepted',
//             },
//         });

//         if (!member) {
//             return NextResponse.json({ error: 'You are not a member of this team' }, { status: 403 });
//         }

//         // إنشاء الرسالة
//         const message = await prisma.teamMessage.create({
//             data: {
//                 teamId,
//                 senderId: session.user.id,
//                 content,
//             },
//         });

//         return NextResponse.json({ success: true, message }, { status: 201 });
//     } catch (error) {
//         console.error('Error sending message:', error);
//         return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// ✅ جلب رسائل الفريق مع بيانات الفريق وأعضائه
export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamId = params.id;

    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: {
                    select: {
                        id: true,
                        userId: true,
                        status: true,
                        user: {
                            select: { name: true }
                        }
                    }
                },
            },
        });

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        const messages = await prisma.teamMessage.findMany({
            where: { teamId },
            include: {
                sender: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({ team, messages });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}

// ✅ إرسال رسالة
export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamId = params.id;
    const { content } = await req.json();

    try {
        // تحقق أن المستخدم عضو في الفريق
        const isMember = await prisma.teamMember.findFirst({
            where: { teamId, userId: session.user.id, status: 'accepted' }
        });

        if (!isMember) {
            return NextResponse.json({ error: 'You are not allowed to send messages to this team' }, { status: 403 });
        }

        await prisma.teamMessage.create({
            data: {
                content,
                teamId,
                senderId: session.user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
