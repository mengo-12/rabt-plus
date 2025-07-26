import { hash } from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();
    const { name, email, password, role, phone } = data;

    // ✅ تحقق من الحقول
    if (!name || !email || !password || !role || !phone) {
        return NextResponse.json({ message: "الرجاء تعبئة جميع الحقول" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ message: "البريد الإلكتروني مستخدم مسبقًا" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    // ✅ إنشاء المستخدم مع رقم الهاتف
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone, // ✅ حفظ رقم الهاتف
        },
    });

    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح" }, { status: 201 });
}
