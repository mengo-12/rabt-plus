import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { writeFile } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ message: "غير مصرح" }, { status: 401 })

    try {
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: { email: decoded.email },
        })

        if (!user) return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 })

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            cv: user.cv,
        })
    } catch (error) {
        return NextResponse.json({ message: "جلسة غير صالحة" }, { status: 401 })
    }
}

export async function PUT(req) {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ message: "غير مصرح" }, { status: 401 })

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        const formData = await req.formData()

        const name = formData.get("name")
        const password = formData.get("password")
        const oldPassword = formData.get("oldPassword")
        const avatar = formData.get("avatar")
        const cv = formData.get("cv")

        const user = await prisma.user.findUnique({ where: { email: decoded.email } })
        if (!user) return NextResponse.json({ message: "المستخدم غير موجود" }, { status: 404 })

        if (oldPassword && !(await bcrypt.compare(oldPassword, user.password))) {
            return NextResponse.json({ message: "كلمة المرور القديمة غير صحيحة" }, { status: 401 })
        }

        const updatedData = { name }

        if (password && password.trim() !== "") {
            const hashed = await bcrypt.hash(password, 10)
            updatedData.password = hashed
        }

        if (avatar && avatar.size > 0) {
            const buffer = Buffer.from(await avatar.arrayBuffer())
            const fileName = `avatar-${user.id}-${Date.now()}.${avatar.name.split('.').pop()}`
            const filePath = path.join(process.cwd(), "public", "uploads", fileName)
            await writeFile(filePath, buffer)
            updatedData.avatar = `/uploads/${fileName}`
        }

        if (cv && cv.size > 0) {
            const buffer = Buffer.from(await cv.arrayBuffer())
            const fileName = `cv-${user.id}-${Date.now()}.${cv.name.split('.').pop()}`
            const filePath = path.join(process.cwd(), "public", "uploads", fileName)
            await writeFile(filePath, buffer)
            updatedData.cv = `/uploads/${fileName}`
        }

        await prisma.user.update({
            where: { email: decoded.email },
            data: updatedData,
        })

        return NextResponse.json({ message: "تم تحديث الملف بنجاح" })
    } catch (err) {
        console.error("PUT /api/profile error:", err)
        return NextResponse.json({ message: "خطأ أثناء التحديث" }, { status: 500 })
    }
}
