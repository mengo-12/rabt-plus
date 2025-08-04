// 'use client';
// import useSWR, { mutate } from 'swr';
// import { useState } from 'react';
// import TeamChatRoom from './TeamChatRoom'; // نفس الملف الذي عندك

// const fetcher = url => fetch(url).then(res => res.json());

// export default function TeamChatLayout() {
//     const { data, isLoading } = useSWR('/api/my-teams', fetcher, { refreshInterval: 5000 });
//     const [selectedTeam, setSelectedTeam] = useState(null);

//     if (isLoading) return <p>تحميل...</p>;

//     const teams = data?.teams || [];
//     const currentUserId = data?.currentUserId;

// const handleLeaveTeam = async (teamId) => {
//     if (!confirm('هل أنت متأكد من الانسحاب من هذا الفريق؟')) return;

//     const res = await fetch(`/api/teams/${teamId}/leave`, {
//         method: 'POST',
//     });

//     if (res.ok) {
//         // تحديث القائمة بدون إعادة تحميل الصفحة (Invalidate SWR Cache)
//         mutate('/api/my-teams');
//         if (selectedTeam?.id === teamId) setSelectedTeam(null);
//     } else {
//         const data = await res.json();
//         alert(data.error || 'فشل في الانسحاب من الفريق');
//     }
// };




//     const handleRemoveMember = async (teamId, memberId) => {
//         if (!confirm('هل أنت متأكد من طرد هذا العضو؟')) return;

//         const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, { method: 'DELETE' });
//         if (res.ok) {
//             await mutate('/api/my-teams');
//             if (selectedTeam) {
//                 // تحديث الفريق الحالي بعد طرد العضو
//                 setSelectedTeam(prev => ({
//                     ...prev,
//                     members: prev.members.filter(m => m.id !== memberId)
//                 }));
//             }
//         } else {
//             const data = await res.json();
//             alert(data.error || 'فشل في طرد العضو');
//         }
//     };

//     return (
//         <div className="flex h-screen">
//             {/* Sidebar Teams */}
//             <div className="w-1/4 border-r p-4">
//                 <h2 className="font-bold mb-4">الفرق</h2>
//                 <ul className="space-y-2">
//                     {teams.map(team => (
//                         <li key={team.id} className="flex justify-between items-center">
//                             <button
//                                 onClick={() => setSelectedTeam(team)}
//                                 className={`block w-full text-right ${selectedTeam?.id === team.id ? 'font-bold text-blue-600' : ''}`}
//                             >
//                                 {team.name}
//                             </button>
//                             <button
//                                 onClick={() => handleLeaveTeam(team.id)}
//                                 className="text-red-500 text-sm ml-2"
//                             >
//                                 خروج
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Sidebar Members */}
//             <div className="w-1/4 border-r p-4">
//                 <h2 className="font-bold mb-4">الأعضاء</h2>
//                 {selectedTeam ? (
//                     <>
//                         <ul className="space-y-2">
//                             {selectedTeam.members.map(member => (
//                                 <li key={member.id} className="flex justify-between items-center">
//                                     <span>{member.user.name}</span>
//                                     {selectedTeam.ownerId === currentUserId && member.user.id !== currentUserId && (
//                                         <button
//                                             onClick={() => handleRemoveMember(selectedTeam.id, member.id)}
//                                             className="text-red-500 hover:underline text-sm"
//                                         >
//                                             طرد
//                                         </button>
//                                     )}
//                                 </li>
//                             ))}
//                         </ul>

//                         {/* زر الخروج من الفريق (إذا لم يكن Owner) */}
//                         {selectedTeam.ownerId !== currentUserId && (
//                             <button
//                                 onClick={() => handleLeaveTeam(selectedTeam.id)}
//                                 className="mt-4 text-red-500 hover:underline"
//                             >
//                                 الخروج من الفريق
//                             </button>
//                         )}
//                     </>
//                 ) : (
//                     <p>اختر فريق</p>
//                 )}
//             </div>

//             {/* Chat Room */}
//             <div className="flex-1 p-4">
//                 {selectedTeam ? (
//                     <TeamChatRoom teamId={selectedTeam.id} />
//                 ) : (
//                     <p>اختر فريق لعرض المحادثة</p>
//                 )}
//             </div>
//         </div>
//     );
// }


// app/dashboard/team-chat/page.jsx
'use client';
import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import TeamChatRoom from './TeamChatRoom';

const fetcher = url => fetch(url).then(res => res.json());

export default function TeamChatLayout() {
    const { data, isLoading } = useSWR('/api/my-teams', fetcher, { refreshInterval: 5000 });
    const [selectedTeam, setSelectedTeam] = useState(null);

    if (isLoading) return <p>تحميل...</p>;

    const teams = data?.teams || [];
    const currentUserId = data?.currentUserId;

    const handleLeaveTeam = async (teamId) => {
        if (!confirm('هل أنت متأكد من الانسحاب من هذا الفريق؟')) return;

        const res = await fetch(`/api/teams/${teamId}/leave`, { method: 'POST' });

        if (res.ok) {
            mutate('/api/my-teams');
            if (selectedTeam?.id === teamId) setSelectedTeam(null);
        } else {
            const data = await res.json();
            alert(data.error || 'فشل في الانسحاب من الفريق');
        }
    };

    const handleRemoveMember = async (teamId, memberId) => {
        if (!confirm('هل أنت متأكد من طرد هذا العضو؟')) return;

        const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, { method: 'DELETE' });

        if (res.ok) {
            mutate('/api/my-teams');
            if (selectedTeam) {
                setSelectedTeam(prev => ({
                    ...prev,
                    members: prev.members.filter(m => m.id !== memberId)
                }));
            }
        } else {
            const data = await res.json();
            alert(data.error || 'فشل في طرد العضو');
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            <div className="flex justify-center items-center flex-1">
                <div className="w-full max-w-6xl h-[80vh] flex border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
                    
                    {/* Teams List (Right Side) */}
                    <div className="w-1/4 border-l overflow-y-auto p-4">
                        <h2 className="font-bold mb-4 text-gray-700 dark:text-white">الفرق</h2>
                        <ul className="space-y-2">
                            {teams.map(team => (
                                <li key={team.id}>
                                    <button
                                        onClick={() => setSelectedTeam(team)}
                                        className={`block w-full text-right p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                            selectedTeam?.id === team.id ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''
                                        }`}
                                    >
                                        {team.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Chat Room (Center) */}
                    <div className="flex-1 relative flex flex-col border-l border-r">
                        {selectedTeam ? (
                            <TeamChatRoom teamId={selectedTeam.id} currentUserId={currentUserId} />
                        ) : (
                            <div className="flex-1 flex justify-center items-center text-gray-500 dark:text-gray-400">
                                اختر فريق لعرض المحادثة
                            </div>
                        )}
                    </div>

                    {/* Members List (Left Side) */}
                    <div className="w-1/4 overflow-y-auto p-4">
                        <h2 className="font-bold mb-4 text-gray-700 dark:text-white">الأعضاء</h2>
                        {selectedTeam ? (
                            <>
                                <ul className="space-y-2">
                                    {selectedTeam.members.map(member => (
                                        <li key={member.id} className="flex justify-between items-center">
                                            <span className="text-gray-800 dark:text-gray-200">{member.user.name}</span>
                                            {selectedTeam.ownerId === currentUserId && member.user.id !== currentUserId && (
                                                <button
                                                    onClick={() => handleRemoveMember(selectedTeam.id, member.id)}
                                                    className="text-red-500 hover:underline text-sm"
                                                >
                                                    طرد
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {selectedTeam.ownerId !== currentUserId && (
                                    <button
                                        onClick={() => handleLeaveTeam(selectedTeam.id)}
                                        className="mt-4 text-red-500 hover:underline"
                                    >
                                        الخروج من الفريق
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500">اختر فريق</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}






