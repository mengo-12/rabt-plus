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


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'البريد الإلكتروني مفقود' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                name: true,
                phone: true,
                bio: true,
                description: true,
                avatar: true,
                cv: true,
            },
        });

        console.log('GET user profile:', user); // ✅ تحقق من البيانات

        if (!user) {
            return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('❌ خطأ أثناء جلب البيانات:', error);
        return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const formData = await req.formData();

        const email = formData.get('email');
        const name = formData.get('name');
        const phone = formData.get('phone');
        const bio = formData.get('bio');
        const description = formData.get('description');
        const avatarFile = formData.get('avatar');
        const cvFile = formData.get('cv');

        if (!email) {
            return NextResponse.json({ error: 'البريد الإلكتروني مفقود' }, { status: 400 });
        }

        let avatarUrl = null;
        let cvUrl = null;

        if (avatarFile && avatarFile.name) {
            const avatarBuffer = Buffer.from(await avatarFile.arrayBuffer());

            const avatarUpload = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'avatars',
                        resource_type: 'image',
                        public_id: avatarFile.name.split('.')[0],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                stream.end(avatarBuffer);
            });

            avatarUrl = avatarUpload.secure_url;
            console.log('Uploaded avatar URL:', avatarUrl); // ✅ تأكد من رابط الصورة
        }

        if (cvFile && cvFile.name) {
            const cvBuffer = Buffer.from(await cvFile.arrayBuffer());

            const cvUpload = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'cv_files',
                        resource_type: 'raw',
                        public_id: cvFile.name.split('.')[0],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                stream.end(cvBuffer);
            });

            cvUrl = cvUpload.secure_url;
            console.log('Uploaded CV URL:', cvUrl); // ✅ تأكد من رابط ملف الـ PDF
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                name,
                phone,
                bio,
                description,
                ...(avatarUrl && { avatar: avatarUrl }),
                ...(cvUrl && { cv: cvUrl }),
            },
        });

        console.log('Updated user:', updatedUser); // ✅ تحقق من بيانات المستخدم بعد التحديث

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('❌ خطأ أثناء تحديث الملف الشخصي:', error);
        return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
    }
}






