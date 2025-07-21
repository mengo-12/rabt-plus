import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
    const { id } = params

    try {
        const freelancer = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                avatar: true,
                bio: true,
                description: true,
                cv: true, // إذا كنت تعرض رابط السيرة الذاتية
            },
        })

        if (!freelancer) {
            return NextResponse.json({ message: 'المستقل غير موجود' }, { status: 404 })
        }

        return NextResponse.json(freelancer)
    } catch (error) {
        console.error('خطأ في جلب بيانات المستقل:', error)
        return NextResponse.json({ message: 'حدث خطأ' }, { status: 500 })
    }
}
