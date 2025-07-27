import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // تأكد أن لديك ملف lib/prisma.js جاهز

export async function GET(request, { params }) {
    const { id } = params

    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        phone: true, // 👈 إضافة رقم الهاتف
                        email: true,
                    },
                },
            },
        })

        if (!project) {
            return NextResponse.json({ error: 'المشروع غير موجود' }, { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error('خطأ في جلب المشروع:', error)
        return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 })
    }
}
