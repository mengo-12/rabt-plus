import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const members = await prisma.teamMember.findMany({
            where: {
                userId: session.user.id,
                status: 'pending',
            },
            include: {
                team: true,
            },
        });

        return NextResponse.json({ members });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
    }
}
