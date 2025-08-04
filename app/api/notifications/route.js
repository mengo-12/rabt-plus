// app/api/notifications/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId: session.user.id,
            isRead: false, // فقط الغير مقروءة
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ notifications });
}
