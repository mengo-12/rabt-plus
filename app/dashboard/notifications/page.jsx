'use client';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (res.ok) {
                setNotifications(data.notifications);
            }
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
        if (res.ok) {
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    };

    const deleteNotification = async (id) => {
        const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setNotifications(notifications.filter(n => n.id !== id));
        }
    };

    if (loading) return <p className="text-center py-10">جاري التحميل...</p>;

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">الإشعارات</h1>

            {notifications.length === 0 ? (
                <p>لا توجد إشعارات.</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`border p-4 rounded shadow flex justify-between items-center ${notif.isRead ? 'bg-gray-100' : 'bg-yellow-50'}`}
                        >
                            <div>
                                <h2 className="font-semibold">{notif.title}</h2>
                                <p className="text-sm text-gray-600">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="flex gap-2">
                                {!notif.isRead && (
                                    <button
                                        onClick={() => markAsRead(notif.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        تعليم كمقروء
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteNotification(notif.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
