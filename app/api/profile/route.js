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
import formidable from 'formidable';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const prisma = new PrismaClient();

export async function PUT(req) {
    try {
        const form = formidable({ multiples: false });

        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const { name, email } = fields;
        const cvFile = files.cv;

        let cvUrl = null;

        if (cvFile) {
            const uploaded = await cloudinary.uploader.upload(cvFile.filepath, {
                folder: 'cv_files',
                resource_type: 'raw', // يدعم pdf, docx, zip إلخ
            });

            cvUrl = uploaded.secure_url;
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                name,
                cv: cvUrl,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



