import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";

const prisma = new PrismaClient();

export async function DELETE(req) {
    try {
        const token = await getToken({ req });

        if (!token || !token.email) {
            return new Response(JSON.stringify({ error: "غير مصرح" }), { status: 401 });
        }

        await prisma.user.update({
            where: { email: token.email },
            data: { cv: null },
        });

        return new Response(JSON.stringify({ message: "تم حذف السيرة الذاتية" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting CV:", error);
        return new Response(JSON.stringify({ error: "فشل حذف السيرة الذاتية" }), { status: 500 });
    }
}
