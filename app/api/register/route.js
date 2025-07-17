// /api/register/route.js
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

export async function POST(req) {
    const { name, email, password, role } = await req.json()

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return NextResponse.json({ message: "البريد الإلكتروني مستخدم بالفعل" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
    })

    // ✅ إنشاء التوكن وتسجيل الدخول تلقائيًا
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    )

    const res = NextResponse.json({
        message: "تم إنشاء الحساب",
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
        },
    })

    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    })

    return res
}
