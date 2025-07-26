import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    const projects = await prisma.project.findMany({
        include: { client: true },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
}

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'client') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, budget } = await request.json();

    const newProject = await prisma.project.create({
        data: {
            title,
            description,
            budget: budget ? parseFloat(budget) : null,
            clientId: session.user.id,
        },
    });

    return NextResponse.json(newProject);
}

