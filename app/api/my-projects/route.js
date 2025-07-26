import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
        where: {
            clientId: session.user.id,
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    return Response.json(projects);
}
