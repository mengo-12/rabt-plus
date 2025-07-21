// import { hash } from "bcryptjs";
// import { prisma } from "../../../lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//     const data = await req.json();
//     const { name, email, password, description } = data;

//     if (!name || !email || !password) {
//         return NextResponse.json({ message: "الرجاء تعبئة جميع الحقول" }, { status: 400 });
//     }

//     const existingUser = await prisma.user.findUnique({ where: { email } });
//     if (existingUser) {
//         return NextResponse.json({ message: "البريد الإلكتروني مستخدم مسبقًا" }, { status: 400 });
//     }
    

//     const hashedPassword = await hash(password, 10);

//     await prisma.user.create({
//         data: {
//             name,
//             email,
//             password: hashedPassword,
//             description,
//             role: "freelancer",
//         },
//     });

//     return NextResponse.json({ message: "تم إنشاء الحساب بنجاح" }, { status: 201 });
// }

import { hash } from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();
    const { name, email, password, description, role } = data;

    if (!name || !email || !password || !role) {
        return NextResponse.json({ message: "الرجاء تعبئة جميع الحقول" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ message: "البريد الإلكتروني مستخدم مسبقًا" }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            description: description || '',
            role, // من العميل
        },
    });

    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح" }, { status: 201 });
}
