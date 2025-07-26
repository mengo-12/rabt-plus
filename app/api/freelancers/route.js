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



