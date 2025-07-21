import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const topFreelancers = await prisma.user.findMany({
            where: { role: 'freelancer' },
            // orderBy: { rating: 'desc' },
            take: 4,
            select: {
                id: true,
                name: true,
                avatar: true,
                bio: true,
                description: true,
                // rating: true,  // إذا تريد ترجع التقييم
            },
        });

        return NextResponse.json(topFreelancers);
    } catch (error) {
        console.error('فشل في جلب المستقلين:', error);
        return NextResponse.json({ error: 'فشل في جلب المستقلين' }, { status: 500 });
    }
}

