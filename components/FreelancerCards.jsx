'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FreelancerCards() {
    const [freelancers, setFreelancers] = useState([]);

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const res = await fetch('/api/freelancers');
                const data = await res.json();
                setFreelancers(data);
            } catch (error) {
                console.error('فشل في جلب بيانات المستقلين:', error);
            }
        };

        fetchFreelancers();
    }, []);

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    مستقلونا المميزون
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {freelancers.map((freelancer) => (
                        <Link
                            href={`/freelancers/${freelancer.id}${freelancer.id}`}
                            key={freelancer.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition p-6 text-center"
                        >
                            <img
                                src={freelancer.avatar || '/images/default-avatar.png'}
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
                                    {freelancer.description.slice(0, 120)}...
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
