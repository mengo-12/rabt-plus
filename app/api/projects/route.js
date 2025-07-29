// import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'

// export async function GET() {
//     const projects = await prisma.project.findMany({
//         include: { client: true },
//         orderBy: { createdAt: 'desc' },
//     })
//     return NextResponse.json(projects)
// }

// export async function POST(request) {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== 'client') {
//         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { title, description, budget } = await request.json();

//     const newProject = await prisma.project.create({
//         data: {
//             title,
//             description,
//             budget: budget ? parseFloat(budget) : null,
//             clientId: session.user.id,
//         },
//     });

//     return NextResponse.json(newProject);
// }

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page')) || 1
        const search = searchParams.get('search') || ''
        const pageSize = 6

        // بناء شرط البحث
        const where = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {}

        // جلب المشاريع مع pagination والبحث
        const projects = await prisma.project.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { client: true },
        })

        // التحقق هل هناك المزيد من المشاريع
        const totalCount = await prisma.project.count({ where })
        const hasMore = page * pageSize < totalCount

        return NextResponse.json({ projects, hasMore })
    } catch (error) {
        console.error('خطأ في جلب المشاريع:', error)
        return NextResponse.json(
            { message: 'حدث خطأ أثناء جلب المشاريع' },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'client') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, budget } = await request.json()

    const newProject = await prisma.project.create({
        data: {
            title,
            description,
            budget: budget ? parseFloat(budget) : null,
            clientId: session.user.id,
        },
    })

    return NextResponse.json(newProject)
}