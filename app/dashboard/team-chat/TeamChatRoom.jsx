// 'use client';
// import useSWR from 'swr';
// import { useState } from 'react';

// const fetcher = url => fetch(url).then(res => res.json());

// export default function TeamChatRoom({ teamId }) {
//     const { data, mutate } = useSWR(`/api/teams/${teamId}/messages`, fetcher, { refreshInterval: 3000 });
//     const [message, setMessage] = useState('');

//     const sendMessage = async (e) => {
//         e.preventDefault();
//         if (!message.trim()) return;

//         await fetch(`/api/teams/${teamId}/messages`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ content: message }),
//         });

//         setMessage('');
//         mutate(); // Refresh messages
//     };

//     const messages = data?.messages || [];

//     return (
//         <div className="flex flex-col h-full">
//             <div className="flex-1 overflow-y-auto space-y-2 mb-4">
//                 {messages.map(msg => (
//                     <div key={msg.id} className="bg-gray-100 p-2 rounded">
//                         <strong>{msg.sender.name}:</strong> {msg.content}
//                     </div>
//                 ))}
//             </div>
//             <form onSubmit={sendMessage} className="flex">
//                 <input
//                     type="text"
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     className="flex-1 border rounded p-2"
//                     placeholder="اكتب رسالة..."
//                 />
//                 <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">إرسال</button>
//             </form>
//         </div>
//     );
// }


// app/dashboard/team-chat/TeamChatRoom.jsx
'use client';
import useSWR from 'swr';
import { useState, useRef, useEffect } from 'react';

const fetcher = url => fetch(url).then(res => res.json());

export default function TeamChatRoom({ teamId, currentUserId }) {
    const { data, mutate } = useSWR(`/api/teams/${teamId}/messages`, fetcher, { refreshInterval: 3000 });
    const [message, setMessage] = useState('');
    const chatEndRef = useRef(null);

    const messages = data?.messages || [];

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        await fetch(`/api/teams/${teamId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
        });

        setMessage('');
        mutate();
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender.id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs p-3 rounded-xl ${
                            msg.sender.id === currentUserId 
                                ? 'bg-blue-500 text-white rounded-br-none' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                        }`}>
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t flex bg-white dark:bg-gray-800">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border rounded-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                    placeholder="اكتب رسالة..."
                />
                <button type="submit" className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
                    إرسال
                </button>
            </form>
        </div>
    );
}









