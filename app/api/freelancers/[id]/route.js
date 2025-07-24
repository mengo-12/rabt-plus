// import { prisma } from '../../../../lib/prisma'
// import { NextResponse } from 'next/server'

// export async function GET(request, { params }) {
//     const { id } = params

//     try {
//         const freelancer = await prisma.user.findUnique({
//             where: { id },
//             select: {
//                 id: true,
//                 name: true,
//                 avatar: true,
//                 bio: true,
//                 description: true,
//                 cv: true, // إذا كنت تعرض رابط السيرة الذاتية
//             },
//         })

//         if (!freelancer) {
//             return NextResponse.json({ message: 'المستقل غير موجود' }, { status: 404 })
//         }

//         return NextResponse.json(freelancer)
//     } catch (error) {
//         console.error('خطأ في جلب بيانات المستقل:', error)
//         return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
//     }
// }

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;

    try {
        const session = await getServerSession(authOptions);

        const freelancer = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                avatar: true,
                bio: true,
                description: true,
                cv: true,
                role: true,
                freelancerRatings: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        client: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!freelancer) {
            return NextResponse.json({ error: "المستقل غير موجود" }, { status: 404 });
        }

        const alreadyRated = session?.user?.id
            ? await prisma.rating.findFirst({
                where: {
                    clientId: session.user.id,
                    freelancerId: id,
                },
            })
            : null;

        return NextResponse.json({ freelancer, alreadyRated: !!alreadyRated });
    } catch (error) {
        console.error("خطأ في جلب بيانات المستقل:", error);
        return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
    }
}



