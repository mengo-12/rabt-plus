// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/authOptions";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function POST(req) {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "client") {
//         return new Response(JSON.stringify({ message: "غير مصرح" }), { status: 401 });
//     }

//     const body = await req.json();
//     const { freelancerId, rating, comment } = body;

//     if (!freelancerId || !rating) {
//         return new Response(JSON.stringify({ message: "بيانات ناقصة" }), { status: 400 });
//     }

//     try {
//         // تحقق إذا كان العميل قام بالتقييم سابقًا
//         const existing = await prisma.rating.findUnique({
//             where: {
//                 freelancerId_clientId: {
//                     freelancerId,
//                     clientId: session.user.id,
//                 },
//             },
//         });

//         if (existing) {
//             return new Response(JSON.stringify({ message: "قمت بتقييم هذا المستقل مسبقًا" }), { status: 400 });
//         }

//         const newRating = await prisma.rating.create({
//             data: {
//                 rating: Number(rating),
//                 comment,
//                 freelancer: { connect: { id: freelancerId } },
//                 client: { connect: { id: session.user.id } },
//             },
//         });

//         return new Response(JSON.stringify(newRating), { status: 201 });
//     } catch (error) {
//         console.error("Error creating rating:", error);
//         return new Response(JSON.stringify({ message: "خطأ في الخادم" }), { status: 500 });
//     }
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from '../../../lib/prisma'; // تأكد من المسار الصحيح

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "client") {
        return new Response(JSON.stringify({ message: "غير مصرح" }), { status: 401 });
    }

    const body = await req.json();
    const { freelancerId, rating, comment } = body;

    if (!freelancerId || !rating) {
        return new Response(JSON.stringify({ message: "بيانات ناقصة" }), { status: 400 });
    }

    try {
        // تحقق إذا كان العميل قام بالتقييم سابقًا
        const existing = await prisma.rating.findUnique({
            where: {
                freelancerId_clientId: {
                    freelancerId,
                    clientId: session.user.id,
                },
            },
        });

        if (existing) {
            return new Response(JSON.stringify({ message: "قمت بتقييم هذا المستقل مسبقًا" }), { status: 400 });
        }

        // إنشاء التقييم الجديد
        const newRating = await prisma.rating.create({
            data: {
                rating: Number(rating),
                comment,
                freelancer: { connect: { id: freelancerId } },
                client: { connect: { id: session.user.id } },
            },
        });

        // حساب متوسط التقييم الجديد
        const ratings = await prisma.rating.findMany({
            where: { freelancerId },
            select: { rating: true },
        });

        const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        // تحديث متوسط التقييم في جدول المستخدم
        await prisma.user.update({
            where: { id: freelancerId },
            data: { rating: averageRating },
        });

        return new Response(JSON.stringify(newRating), { status: 201 });
    } catch (error) {
        console.error("Error creating rating:", error);
        return new Response(JSON.stringify({ message: "خطأ في الخادم" }), { status: 500 });
    }
}
