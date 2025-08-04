'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsBell() {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // تحديث كل 60 ثانية
        return () => clearInterval(interval);
    }, []);

    // إغلاق القائمة عند الضغط خارجها
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInvitation = async (notificationId, response) => {
        try {
            const res = await fetch('/api/notifications/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId, response }),
            });

            if (res.ok) {
                // تحديث قائمة الإشعارات
                setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
            } else {
                console.error('Failed to respond to invitation');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 p-3">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">الإشعارات</h3>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">لا توجد إشعارات جديدة</p>
                    ) : (
                        <ul className="space-y-2">
                            {notifications.slice(0, 5).map((notif) => (
                                <li
                                    key={notif.id}
                                    className={`p-2 border rounded ${notif.isRead ? 'bg-gray-50 dark:bg-gray-700' : 'bg-yellow-50 dark:bg-yellow-900'}`}
                                >
                                    <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{notif.message}</p>
                                    {notif.type === 'team_invitation' && notif.data?.teamId && (
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleInvitation(notif.id, 'accepted')}
                                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                قبول
                                            </button>
                                            <button
                                                onClick={() => handleInvitation(notif.id, 'rejected')}
                                                className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                رفض
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    <Link
                        href="/dashboard/notifications"
                        className="block text-center text-blue-600 mt-3 hover:underline text-sm"
                    >
                        عرض جميع الإشعارات
                    </Link>
                </div>
            )}
        </div>
    );
}
