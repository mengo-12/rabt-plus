'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TeamChatPage() {
    const { id: teamId } = useParams();
    const { data, mutate } = useSWR(`/api/teams/${teamId}/messages`, fetcher, { refreshInterval: 3000 });
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const res = await fetch(`/api/teams/${teamId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newMessage }),
        });

        if (res.ok) {
            setNewMessage('');
            mutate(); // تحديث الرسائل مباشرة
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-4">محادثة الفريق</h1>
            <div className="border rounded p-4 h-96 overflow-y-auto bg-white dark:bg-gray-800">
                {data?.messages?.length === 0 && <p className="text-gray-500">لا توجد رسائل بعد.</p>}
                {data?.messages?.map(msg => (
                    <div key={msg.id} className="mb-3">
                        <p className="font-semibold">{msg.sender.name}</p>
                        <p className="text-gray-700 dark:text-gray-300">{msg.content}</p>
                        <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex mt-4 gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                    placeholder="اكتب رسالة..."
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    إرسال
                </button>
            </form>
        </div>
    );
}
