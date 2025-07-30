// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/authOptions";
// import { NextResponse } from "next/server";
// import { prisma } from "../../../lib/prisma";
// import { writeFile } from "fs/promises";
// import path from "path";

// export async function GET(req) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
//     }

//     const user = await prisma.user.findUnique({
//         where: { email: session.user.email },
//     });

//     return NextResponse.json({
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone, // ✅ جلب رقم الهاتف
//         role: user.role,
//         avatar: user.avatar,
//         cv: user.cv,
//         bio: user.bio,
//         description: user.description,
//     });
// }

// export async function PUT(req) {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//         return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
//     }

//     const data = await req.formData();
//     const bio = data.get("bio");
//     const description = data.get("description");
//     const phone = data.get("phone"); // ✅ قراءة رقم الهاتف
//     const file = data.get("cv");
//     const avatar = data.get("avatar");

//     if (description && description.trim().split(/\s+/).length > 150) {
//         return NextResponse.json(
//             { message: "الوصف طويل جدًا. الحد الأقصى 150 كلمة." },
//             { status: 400 }
//         );
//     }

//     const updatedData = {};

//     if (bio) updatedData.bio = bio;
//     if (description) updatedData.description = description;
//     if (phone) updatedData.phone = phone; // ✅ حفظ رقم الهاتف

//     if (file && typeof file.name === "string") {
//         const bytes = await file.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const filePath = path.join("public/uploads", file.name);
//         await writeFile(filePath, buffer);
//         updatedData.cv = `/uploads/${file.name}`;
//     }

//     if (avatar && typeof avatar.name === "string") {
//         const bytes = await avatar.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const filePath = path.join("public/uploads", avatar.name);
//         await writeFile(filePath, buffer);
//         updatedData.avatar = `/uploads/${avatar.name}`;
//     }

//     const updatedUser = await prisma.user.update({
//         where: { email: session.user.email },
//         data: updatedData,
//     });

//     return NextResponse.json(updatedUser);
// }


import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        cv: user.cv,
        bio: user.bio,
        description: user.description,
    });
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "غير مصرح" }, { status: 401 });
        }

        const data = await req.formData();

        const name = data.get("name");
        const bio = data.get("bio");
        const description = data.get("description");
        const phone = data.get("phone");
        const file = data.get("cv");
        const avatar = data.get("avatar");

        if (description && description.trim().split(/\s+/).length > 150) {
            return NextResponse.json(
                { message: "الوصف طويل جدًا. الحد الأقصى 150 كلمة." },
                { status: 400 }
            );
        }

        const updatedData = {};
        if (name) updatedData.name = name;
        if (bio) updatedData.bio = bio;
        if (description) updatedData.description = description;
        if (phone) updatedData.phone = phone;

        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // رفع السيرة الذاتية
        if (file && typeof file.name === "string") {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filePath = path.join(uploadDir, file.name);
            await writeFile(filePath, buffer);
            updatedData.cv = `/uploads/${file.name}`;
        }

        // رفع الصورة الشخصية
        if (avatar && typeof avatar.name === "string") {
            const bytes = await avatar.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filePath = path.join(uploadDir, avatar.name);
            await writeFile(filePath, buffer);
            updatedData.avatar = `/uploads/${avatar.name}`;
        }

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: updatedData,
        });

        return NextResponse.json({ message: "تم تحديث البيانات بنجاح", user: updatedUser });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { message: "حدث خطأ أثناء التحديث", error: error.message },
            { status: 500 }
        );
    }
}

