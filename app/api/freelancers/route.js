// app/api/freelancers/route.js

// import { prisma } from '../../../lib/prisma'

// export async function GET(req) {
//     try {
//         const freelancers = await prisma.user.findMany({
//             where: { role: 'freelancer' },
//             select: {
//                 id: true,
//                 name: true,
//                 avatar: true,
//                 cv: true,
//                 description: true,
//                 // لا نُظهر البريد أو كلمة المرور
//             }
//         })
//         return Response.json(freelancers)
//     } catch (error) {
//         return new Response(JSON.stringify({ error: 'Error fetching freelancers' }), { status: 500 })
//     }
// }


// import { prisma } from '../../../lib/prisma'
// import { NextResponse } from "next/server"

// export async function GET() {
//     try {
//         const freelancers = await prisma.user.findMany({
//             where: { role: 'freelancer' },
//             select: {
//                 id: true,
//                 name: true,
//                 avatar: true,
//                 bio: true,
//                 description: true,
//             },
//         });

//         return NextResponse.json(freelancers);
//     } catch (error) {
//         console.error("فشل في جلب بيانات المستقلين:", error);
//         return NextResponse.json({ message: "حدث خطأ" }, { status: 500 });
//     }
// }

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const freelancers = await prisma.user.findMany({
        where: { role: 'freelancer' },
        select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            freelancerRatings: {
                select: {
                    rating: true,
                },
            },
        },
    })

    const formatted = freelancers.map(f => {
        const ratings = f.freelancerRatings.map(r => r.rating)
        const reviewsCount = ratings.length
        const avgRating =
            reviewsCount > 0
                ? ratings.reduce((a, b) => a + b, 0) / reviewsCount
                : 0

        return {
            id: f.id,
            name: f.name,
            avatar: f.avatar,
            bio: f.bio,
            avgRating,
            reviewsCount,
        }
    })

    return NextResponse.json(formatted)
}



