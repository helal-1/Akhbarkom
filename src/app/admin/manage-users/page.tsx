"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { UserPlus, Trash2, ShieldCheck, Mail, Loader2, Lock } from "lucide-react";

interface AdminUser {
    id: string;
    email: string;
    created_at?: string;
}

export default function ManageAdmins() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAdmins = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) setAdmins(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAdmins();
    }, [fetchAdmins]);

    // دالة الإضافة (مرة واحدة فقط وبدون تكرار)
    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail || !newPassword) return;

        if (newPassword.length < 6) {
            alert("كلمة المرور يجب أن لا تقل عن 6 أحرف");
            return;
        }

        setActionLoading(true);

        // 1. إنشاء حساب في Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: newEmail.toLowerCase().trim(),
            password: newPassword,
            options: {
                emailRedirectTo: undefined, // لتجنب الـ Rate Limit الخاص بالإيميلات
            }
        });

        if (authError) {
            alert(`خطأ في إنشاء الحساب: ${authError.message}`);
        } else {
            // 2. إضافة الإيميل لجدول الصلاحيات
            const { error: dbError } = await supabase
                .from("users")
                .insert([{ email: newEmail.toLowerCase().trim() }]);

            if (dbError) {
                alert("تم إنشاء الحساب ولكن فشل إضافته لجدول الصلاحيات - تأكد من صلاحيات RLS");
            } else {
                alert("تم إضافة الإدمن الجديد بنجاح!");
                setNewEmail("");
                setNewPassword("");
                fetchAdmins();
            }
        }
        setActionLoading(false);
    };

    // دالة الحذف (عشان متبقاش Missing)
    const handleDelete = async (email: string) => {
        if (!confirm(`هل أنت متأكد من سحب صلاحيات الإدمن من: ${email}؟`)) return;

        setActionLoading(true);
        const { error } = await supabase
            .from("users")
            .delete()
            .eq("email", email);

        if (!error) {
            fetchAdmins();
        } else {
            alert("حدث خطأ أثناء الحذف");
        }
        setActionLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8" dir="rtl">
            <div className="flex items-center gap-4 border-b pb-6">
                <div className="bg-blue-600 p-3 rounded-2xl text-white">
                    <ShieldCheck size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">إدارة صلاحيات الإدمن</h1>
                    <p className="text-gray-500 text-sm font-medium">أنشئ حسابات جديدة للمديرين وتحكم في صلاحياتهم</p>
                </div>
            </div>

            <form onSubmit={handleAddAdmin} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 mr-2 uppercase">البريد الإلكتروني</label>
                        <div className="relative">
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-blue-500 font-bold text-gray-800 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 mr-2 uppercase">كلمة المرور</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="password"
                                placeholder="******"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-blue-500 font-bold text-gray-800 transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    disabled={actionLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 w-full md:w-max self-end disabled:opacity-50"
                >
                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                    <span>إنشاء حساب وإضافة كإدمن</span>
                </button>
            </form>

            <div className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-700">المديرين الحاليين ({admins.length})</h2>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-blue-600"><Loader2 className="animate-spin mx-auto" size={32} /></div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {admins.map((admin) => (
                            <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {admin.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 text-sm">{admin.email}</p>
                                        <p className="text-[10px] text-gray-400 font-medium tracking-tight">إدمن معتمد بنظام الوصول</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(admin.email)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}