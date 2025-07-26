// في ملف authOptions أو [...nextauth]/route.js
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });

                if (!user) return null;

                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {


        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.avatar = user.avatar;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.avatar = token.avatar;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // إذا كان العنوان URL يبدأ ب baseUrl، نعيده كما هو
            if (url.startsWith(baseUrl)) return url;
            // وإلا نعيد الصفحة الرئيسية للوحة التحكم
            return baseUrl + '/dashboard/profile';
        },
    }
};
