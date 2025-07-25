import { NextResponse } from "next/server"

export async function POST() {
    const res = NextResponse.json({ message: "تم تسجيل الخروج" })
    res.cookies.set('token', '', {
        httpOnly: true,
        expires: new Date(0), // احذف الكوكي
        path: '/',
    })
    return res
}
