// import { NextResponse } from 'next/server';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth"; // المسار حسب إعداداتك
// import { prisma } from "@/lib/prisma";

// export async function GET(req) {
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         // جلب جميع الفرق التي يملكها أو يمكن تعديل شرط الجلب حسب الحاجة
//         const teams = await prisma.team.findMany({
//             where: { ownerId: session.user.id },
//             include: {
//                 owner: true,
//                 members: {
//                     include: {
//                         user: true,
//                     }
//                 },
//             },
//         });

//         return NextResponse.json({ teams });
//     } catch (error) {
//         console.error("Error fetching teams:", error);
//         return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
//     }
// }

// export async function POST(req) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//         const { name, description, rolesNeeded, members } = await req.json();

//         // إنشاء الفريق
//         const team = await prisma.team.create({
//             data: {
//                 name,
//                 description,
//                 rolesNeeded,
//                 ownerId: session.user.id,
//             },
//         });

//         // إضافة أعضاء الفريق + إرسال إشعارات لهم
//         if (members && Array.isArray(members)) {
//             for (const member of members) {
//                 const teamMember = await prisma.teamMember.create({
//                     data: {
//                         teamId: team.id,
//                         userId: member.userId,
//                         role: member.role,
//                         status: member.status || "pending",
//                     },
//                 });

//                 // إنشاء إشعار للعضو المضاف
//                 await prisma.notification.create({
//                     data: {
//                         userId: member.userId, // هذا العضو
//                         title: "دعوة للانضمام إلى فريق",
//                         message: `${session.user.name} دعاك للانضمام إلى فريق ${team.name} كـ ${member.role}`,
//                         type: "team_invitation",
//                         data: { teamId: team.id, memberId: teamMember.id },
//                     },
//                 });
//             }
//         }

//         return NextResponse.json({ success: true, team }, { status: 201 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
//     }
// }


import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ✅ GET: جلب الفرق
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // جلب جميع الفرق التي يملكها
        const teams = await prisma.team.findMany({
            where: { ownerId: session.user.id },
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, avatar: true },
                        }
                    },
                },
            },
        });

        return NextResponse.json({ teams });
    } catch (error) {
        console.error("Error fetching teams:", error);
        return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
    }
}

// ✅ POST: إنشاء فريق + إضافة صاحب الفريق كعضو
export async function POST(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, description, rolesNeeded, members } = await req.json();

        // إنشاء الفريق مع إضافة صاحب الفريق كعضو
        const team = await prisma.team.create({
            data: {
                name,
                description,
                rolesNeeded,
                ownerId: session.user.id,
                members: {
                    create: [
                        {
                            userId: session.user.id,
                            role: 'قائد الفريق',
                            status: 'accepted',
                        },
                        // الأعضاء الآخرين سنضيفهم بعد قليل
                    ]
                }
            },
            include: {
                members: true,
            }
        });

        // إضافة بقية الأعضاء (إن وجدوا)
        if (members && Array.isArray(members)) {
            for (const member of members) {
                const teamMember = await prisma.teamMember.create({
                    data: {
                        teamId: team.id,
                        userId: member.userId,
                        role: member.role,
                        status: member.status || "pending",
                    },
                });

                // إرسال إشعار للعضو المضاف
                await prisma.notification.create({
                    data: {
                        userId: member.userId,
                        title: "دعوة للانضمام إلى فريق",
                        message: `${session.user.name} دعاك للانضمام إلى فريق ${team.name} كـ ${member.role}`,
                        type: "team_invitation",
                        data: { teamId: team.id, memberId: teamMember.id },
                    },
                });
            }
        }

        return NextResponse.json({ success: true, team }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
    }
}
