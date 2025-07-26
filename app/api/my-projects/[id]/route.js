import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { prisma } from "@/lib/prisma"

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
        where: { id: params.id },
    })

    if (!project || project.clientId !== session.user.id) {
        return Response.json({ message: "Not found or unauthorized" }, { status: 404 })
    }

    await prisma.project.delete({
        where: { id: params.id },
    })

    return Response.json({ message: "Deleted successfully" })
}
