import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

export async function POST(req) {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return NextResponse.json({ message: "كلمة المرور غير صحيحة" }, { status: 401 })
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    )

    const res = NextResponse.json({
        message: "تم تسجيل الدخول",
        role: user.role,
        name: user.name,
        email: user.email,
    })

    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    })

    return res
}
