import useSWR from 'swr';
import { useState } from 'react';

const fetcher = url => fetch(url).then(res => res.json());

export default function TeamChatRoom({ teamId }) {
    const { data, mutate } = useSWR(`/api/teams/${teamId}/messages`, fetcher, { refreshInterval: 3000 });
    const [message, setMessage] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        await fetch(`/api/teams/${teamId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        });

        setMessage('');
        mutate(); // Refresh messages
    };

    const messages = data?.messages || [];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map(msg => (
                    <div key={msg.id} className="bg-gray-100 p-2 rounded">
                        <strong>{msg.sender.name}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border rounded p-2"
                    placeholder="اكتب رسالة..."
                />
                <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">إرسال</button>
            </form>
        </div>
    );
}
