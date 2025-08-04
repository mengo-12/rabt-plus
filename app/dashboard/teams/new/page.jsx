'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function CreateTeamPage() {
    const { t } = useTranslation();
    const { data: session } = useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [rolesNeeded, setRolesNeeded] = useState([]);
    const [members, setMembers] = useState([]); // أعضاء الفريق
    const [allFreelancers, setAllFreelancers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    useEffect(() => {
        async function fetchFreelancers() {
            const res = await fetch("/api/freelancers");
            const data = await res.json();
            if (res.ok) {
                setAllFreelancers(data);  // هنا مباشرة لأن data هو مصفوفة
            }
        }
        fetchFreelancers();
    }, []);


    const handleAddRole = (role) => {
        if (role && !rolesNeeded.includes(role)) {
            setRolesNeeded([...rolesNeeded, role]);
        }
    };

    const handleAddMember = () => {
        if (selectedUserId && selectedRole && !members.find(m => m.userId === selectedUserId)) {
            setMembers([...members, { userId: selectedUserId, role: selectedRole, status: "pending" }]);
            setSelectedUserId("");
            setSelectedRole("");
        }
    };

    const handleRemoveMember = (userId) => {
        setMembers(members.filter(m => m.userId !== userId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, description, rolesNeeded, members }),
        });

        const data = await res.json();

        if (data.success) {
            router.push("/dashboard/teams");
        } else {
            alert(data.error || "خطأ في إنشاء الفريق");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">{t("create_team")}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block mb-1 font-medium">{t("team_name")}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t("team_description")}</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t("roles_needed")}</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder={t("enter_role")}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddRole(e.target.value);
                                    e.target.value = "";
                                }
                            }}
                            className="flex-1 border rounded px-3 py-2"
                        />
                    </div>

                    {/* عرض الرولات المضافة */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {rolesNeeded.map((role, idx) => (
                            <div key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-2">
                                <span>{role}</span>
                                <button
                                    type="button"
                                    onClick={() => setRolesNeeded(rolesNeeded.filter((r, i) => i !== idx))}
                                    className="text-red-500 hover:text-red-700"
                                    aria-label={`حذف الرول ${role}`}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">{t("add_member")}</label>
                    <div className="flex gap-2 items-center">
                        <select
                            value={selectedUserId}
                            onChange={e => setSelectedUserId(e.target.value)}
                            className="border rounded px-3 py-2 flex-1"
                        >
                            <option value="">{t("select_freelancer")}</option>
                            {allFreelancers.map((f) => (
                                <option key={f.id} value={f.id}>
                                    {f.name} ({f.email})
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder={t("role")}
                            value={selectedRole}
                            onChange={e => setSelectedRole(e.target.value)}
                            className="border rounded px-3 py-2 flex-1"
                        />

                        <button
                            type="button"
                            onClick={handleAddMember}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {t("add")}
                        </button>
                    </div>

                    <div className="mt-3">
                        {members.map(({ userId, role }) => {
                            const user = allFreelancers.find(f => f.id === userId);
                            return (
                                <div
                                    key={userId}
                                    className="flex items-center justify-between border p-2 rounded mt-1"
                                >
                                    <span>{user?.name || userId} — {role}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMember(userId)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        {t("remove")}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                    {t("save_team")}
                </button>
            </form>
        </div>
    );
}
