// // app/api/auth/[...nextauth]/route.js
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "../../../../lib/prisma";
// import { compare } from "bcryptjs";

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 const user = await prisma.user.findUnique({
//                     where: { email: credentials.email },
//                 });

//                 if (!user) throw new Error("لا يوجد حساب بهذا البريد");

//                 const isValid = await compare(credentials.password, user.password);
//                 if (!isValid) throw new Error("كلمة المرور غير صحيحة");

//                 return {
//                     id: user.id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                 };
//             },
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//     },
//     pages: {
//         signIn: "/login",
//         error: '/login'
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) token.role = user.role;
//             return token;
//         },
//         async session({ session, token }) {
//             if (token) session.user.role = token.role;
//             return session;
//         },
//     },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth"
import { authOptions } from "./authOptions"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }