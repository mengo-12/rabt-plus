// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/prisma';

// // ✅ PATCH: قبول / رفض الدعوة
// export async function PATCH(req, { params }) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = params;
//     const { action, memberId } = await req.json(); // ⬅️ نأخذ memberId من Body

//     if (!['accept', 'reject'].includes(action)) {
//         return NextResponse.json({ error: "Invalid action" }, { status: 400 });
//     }

//     try {
//         const teamMember = await prisma.teamMember.findUnique({
//             where: { id: memberId }, // ⬅️ نبحث باستخدام memberId
//             include: { team: true },
//         });

//         if (!teamMember || teamMember.userId !== session.user.id) {
//             return NextResponse.json({ error: "Team member not found or not authorized" }, { status: 404 });
//         }

//         await prisma.teamMember.update({
//             where: { id: memberId }, // ⬅️ التحديث باستخدام memberId
//             data: { status: action === 'accept' ? 'accepted' : 'rejected' },
//         });

//         // تحديث الإشعار إلى مقروء
//         await prisma.notification.updateMany({
//             where: {
//                 userId: session.user.id,
//                 data: { path: ['memberId'], equals: id } // تأكد أن هذا هو مسار memberId في الـ JSONB
//             },
//             data: { isRead: true },
//         });

//         // إرسال إشعار لصاحب الفريق
//         await prisma.notification.create({
//             data: {
//                 userId: teamMember.team.ownerId,
//                 title: `رد على دعوة الفريق`,
//                 message: `${session.user.name} قام بـ ${action === 'accept' ? 'قبول' : 'رفض'} الدعوة لفريق ${teamMember.team.name}`,
//                 type: 'team_invitation',
//                 data: { teamId: teamMember.team.id, memberId: teamMember.id },
//             },
//         });

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Failed to update member status" }, { status: 500 });
//     }
// }

// // ✅ DELETE: حذف الفريق (لصاحب الفريق فقط)
// export async function DELETE(req, { params }) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const teamId = params.id;

//     try {
//         const team = await prisma.team.findUnique({
//             where: { id: teamId },
//         });

//         if (!team || team.ownerId !== session.user.id) {
//             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//         }

//         // حذف أعضاء الفريق أولاً
//         await prisma.teamMember.deleteMany({
//             where: { teamId },
//         });

//         // حذف الفريق
//         await prisma.team.delete({
//             where: { id: teamId },
//         });

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
//     }
// }

// // ✅ GET: جلب بيانات الفريق مع الأعضاء وحالاتهم
// export async function GET(req, { params }) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const teamId = params.id;

//     try {
//         const team = await prisma.team.findUnique({
//             where: { id: teamId },
//             include: {
//                 members: {
//                     include: {
//                         user: {
//                             select: { id: true, name: true, email: true, avatar: true },
//                         },
//                     },
//                 },
//             },
//         });

//         if (!team) {
//             return NextResponse.json({ error: "Team not found" }, { status: 404 });
//         }

//         return NextResponse.json({ team });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
//     }
// }



import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// ✅ PATCH: قبول / رفض الدعوة
export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { action, memberId } = await req.json(); // memberId = teamMember.id

    if (!['accept', 'reject'].includes(action)) {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    try {
        const teamMember = await prisma.teamMember.findUnique({
            where: { id: memberId },
            include: { team: true },
        });

        if (!teamMember || teamMember.userId !== session.user.id) {
            return NextResponse.json({ error: "Team member not found or not authorized" }, { status: 404 });
        }

        const newStatus = action === 'accept' ? 'accepted' : 'rejected';
        if (teamMember.status === newStatus) {
            return NextResponse.json({ message: "Status already updated" }, { status: 200 });
        }

        await prisma.teamMember.update({
            where: { id: memberId },
            data: { status: newStatus },
        });

        await prisma.notification.updateMany({
            where: {
                userId: session.user.id,
                data: { path: ['memberId'], equals: memberId },
            },
            data: { isRead: true },
        });

        await prisma.notification.create({
            data: {
                userId: teamMember.team.ownerId,
                title: `رد على دعوة الفريق`,
                message: `${session.user.name} قام بـ ${action === 'accept' ? 'قبول' : 'رفض'} الدعوة لفريق ${teamMember.team.name}`,
                type: 'team_invitation',
                data: { teamId: teamMember.team.id, memberId: teamMember.id },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update member status" }, { status: 500 });
    }
}

// ✅ DELETE: حذف الفريق (لصاحب الفريق فقط)
export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamId = params.id;

    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
        });

        if (!team || team.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // حذف أعضاء الفريق أولاً
        await prisma.teamMember.deleteMany({
            where: { teamId },
        });

        // حذف الرسائل (اختياري إذا أضفت رسائل)
        await prisma.teamMessage.deleteMany({
            where: { teamId },
        });

        // حذف الفريق
        await prisma.team.delete({
            where: { id: teamId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete team" }, { status: 500 });
    }
}

