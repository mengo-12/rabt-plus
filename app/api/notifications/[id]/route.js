// app/api/notifications/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.notification.delete({
        where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
}
