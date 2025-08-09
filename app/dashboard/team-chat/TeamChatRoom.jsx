'use client';
import useSWR from 'swr';
import { useState, useEffect, useRef } from 'react';

const fetcher = url => fetch(url).then(res => res.json());

export default function TeamChatRoom({ teamId }) {
    const { data, mutate } = useSWR(`/api/teams/${teamId}/messages`, fetcher, { refreshInterval: 3000 });
    const { data: teamData } = useSWR(`/api/teams/${teamId}`, fetcher);
    const { data: userData } = useSWR('/api/me', fetcher);

    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const messages = data?.messages || [];
    const currentUserId = userData?.user?.id;

    const isMemberAccepted = teamData?.members?.some(
        m => m.userId === currentUserId && m.status === 'accepted'
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (teamData && !isMemberAccepted) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-500 p-4 text-center">
                تم طردك من هذا الفريق ولا يمكنك إرسال رسائل.
            </div>
        );
    }

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

    return (
        <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-gray-100 dark:bg-gray-900">
            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map(msg => {
                    const isCurrentUser = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end space-x-2 max-w-[80%] sm:max-w-[70%] break-words ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {/* صورة المستخدم */}
                                <img
                                    src={msg.sender.avatar || '/default-avatar.png'}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full border border-gray-300"
                                />

                                {/* الفقاعة مع الذيول */}
                                <div
                                    className={`relative rounded-2xl p-3 text-sm sm:text-base shadow-md
                                        ${isCurrentUser ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-700 dark:text-white'}
                                    `}
                                    style={{
                                        borderTopRightRadius: isCurrentUser ? '0' : '1rem',
                                        borderTopLeftRadius: isCurrentUser ? '1rem' : '0'
                                    }}
                                >
                                    {/* الذيول */}
                                    <span
                                        className={`absolute bottom-0 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent
                                            ${isCurrentUser
                                                ? 'right-[-8px] border-l-[10px] border-l-green-500'
                                                : 'left-[-8px] border-r-[10px] border-r-white dark:border-r-gray-700'
                                            }
                                        `}
                                    ></span>

                                    <p className="font-semibold mb-1">{msg.sender.name}</p>
                                    <p>{msg.content}</p>
                                    <span className="text-[10px] text-gray-200 dark:text-gray-400 absolute bottom-1 right-2">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef}></div>
            </div>

            {/* إرسال الرسائل */}
            <form onSubmit={sendMessage} className="p-2 border-t dark:border-gray-700 flex items-center gap-2 bg-white dark:bg-gray-800">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 border rounded-full px-3 py-2 focus:outline-none text-sm sm:text-base dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                    placeholder="اكتب رسالة..."
                />
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base"
                >
                    إرسال
                </button>
            </form>
        </div>
    );
}






