'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';

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
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!freelancers.length) {
        return (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                لا يوجد مستقلون للعرض حالياً.
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-100 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-800 dark:text-white">
                    مستقلونا الأعلى تقييماً
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {freelancers.map((freelancer) => (
                        <Link
                            href={`/freelancers/${freelancer.id}`}
                            key={freelancer.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col items-center text-center p-6"
                        >
                            <div className="relative w-24 h-24">
                                {freelancer.avatar ? (
                                    <img
                                        src={freelancer.avatar}
                                        alt={freelancer.name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                                    />
                                ) : (
                                    <FaUserCircle className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                                )}
                            </div>

                            <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-white">
                                {freelancer.name}
                            </h3>

                            {freelancer.bio && (
                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
                                    {freelancer.bio}
                                </p>
                            )}

                            {freelancer.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                                    {freelancer.description.length > 120
                                        ? freelancer.description.slice(0, 120) + '...'
                                        : freelancer.description}
                                </p>
                            )}

                            <div className="flex items-center mt-4 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(freelancer.rating || 0)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    {freelancer.rating?.toFixed(1) || '0.0'}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* زر عرض الجميع */}
                <div className="mt-12 text-center">
                    <Link
                        href="/allFreelancers"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                        عرض جميع المستقلين
                    </Link>
                </div>
            </div>
        </section>
    );
}