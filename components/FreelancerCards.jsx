// 'use client';
// import React, { useEffect, useState } from 'react';
// import Link from 'next/link';

// export default function FreelancerCards() {
//     const [freelancers, setFreelancers] = useState([]);

//     useEffect(() => {
//         const fetchFreelancers = async () => {
//             try {
//                 const res = await fetch('/api/freelancers');
//                 const data = await res.json();
//                 setFreelancers(data);
//             } catch (error) {
//                 console.error('فشل في جلب بيانات المستقلين:', error);
//             }
//         };

//         fetchFreelancers();
//     }, []);

//     return (
//         <section className="py-16 bg-gray-50 dark:bg-gray-900">
//             <div className="container mx-auto px-4">
//                 <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
//                     مستقلونا المميزون
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//                     {freelancers.map((freelancer) => (
//                         <Link
//                             href={`/freelancers/${freelancer.id}${freelancer.id}`}
//                             key={freelancer.id}
//                             className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition p-6 text-center"
//                         >
//                             <img
//                                 src={freelancer.avatar || '/images/default-avatar.png'}
//                                 alt={freelancer.name}
//                                 className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
//                             />
//                             <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
//                                 {freelancer.name}
//                             </h3>

//                             {freelancer.bio && (
//                                 <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 line-clamp-2">
//                                     {freelancer.bio}
//                                 </p>
//                             )}

//                             {freelancer.description && (
//                                 <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
//                                     {freelancer.description.slice(0, 120)}...
//                                 </p>
//                             )}
//                         </Link>
//                     ))}

//                 </div>
//             </div>
//         </section>
//     );
// }


// 


'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FreelancerCards() {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchFreelancers() {
            try {
                const res = await fetch('/api/freelancers/top');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                console.log('🔍 freelancers:', data);
                setFreelancers(data);
            } catch (err) {
                console.error('فشل في جلب بيانات المستقلين:', err);
                setError('فشل في تحميل المستقلين');
            } finally {
                setLoading(false);
            }
        }

        fetchFreelancers();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                جاري تحميل المستقلين...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                {error}
            </div>
        );
    }

    if (!freelancers.length) {
        return (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                لا يوجد مستقلون للعرض حالياً.
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    مستقلونا الأعلى تقييماً
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {freelancers.map((freelancer) => (
                        <Link
                            href={`/freelancers/${freelancer.id}`}
                            key={freelancer.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center text-center hover:shadow-md transition"
                        >
                            <img
                                src={freelancer.avatar || '/default-avatar.png'}
                                alt={freelancer.name}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                            />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {freelancer.name}
                            </h3>
                            {freelancer.bio && (
                                <p className="text-gray-500 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                                    {freelancer.bio}
                                </p>
                            )}
                            {freelancer.description && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
                                    {freelancer.description.length > 120
                                        ? freelancer.description.slice(0, 120) + '...'
                                        : freelancer.description}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>

                {/* زر عرض الجميع */}
                <div className="mt-12 text-center">
                    <Link
                        href="/allFreelancers"
                        className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition"
                    >
                        عرض جميع المستقلين
                    </Link>
                </div>
            </div>
        </section>
    );
}

