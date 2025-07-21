// 'use client';
// import { signIn } from 'next-auth/react';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { useEffect } from 'react';


// export default function LoginPage() {
//     const router = useRouter();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleLogin = async (e) => {
//         e.preventDefault();


//         const res = await signIn('credentials', {
//             redirect: false, // لا تتركه true
//             email,
//             password,
//         });

//         if (res?.error) {
//             setError('بيانات الدخول غير صحيحة');
//         } else if (res.ok) {
//             router.push('/dashboard/profile'); // توجيه يدوي ناجح
//         }



// const res = await signIn('credentials', {
//     redirect: false,
//     email,
//     password,
//     callbackUrl: '/dashboard/profile',
// });

// if (res?.error) {
//     setError('بيانات الدخول غير صحيحة');
// } else {
//     router.push('/dashboard/profile');
// }
// };


// const { data: session } = useSession();

// useEffect(() => {
//     if (session?.user) {
//         router.push('/dashboard/profile');
//     }
// }, [session]);


//     return (
//         <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
//             <h2 className="text-2xl font-bold mb-4">تسجيل الدخول</h2>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             <form onSubmit={handleLogin} className="space-y-4">
//                 <input
//                     type="email"
//                     placeholder="البريد الإلكتروني"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full border rounded p-2"
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="كلمة المرور"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full border rounded p-2"
//                     required
//                 />
//                 <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
//                     دخول
//                 </button>
//             </form>
//         </div>
//     );
// }


'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl: '/dashboard/profile',
        });
        
        console.log('signIn response:', res); // تحقق من هذه البيانات


        if (res?.error) {
            setError('بيانات الدخول غير صحيحة');
        } else if (res.ok) {
            router.push('/dashboard/profile');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">تسجيل الدخول</h2>
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded p-2"
                    required
                />
                <input
                    type="password"
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded p-2"
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                    دخول
                </button>
            </form>
        </div>
    );
}

