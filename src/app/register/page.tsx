"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                router.push("/login?success=account-created");
            } else {
                setError(data.message || "حدث خطأ ما");
            }
        } catch (err) {
            setError("مشكلة في الاتصال بالسيرفر");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden p-6" dir="rtl">
            {/* الخلفية المزخرفة - دوائر ضوئية */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />

            <div className="w-full max-w-[480px] relative">
                {/* زر العودة للرئيسية */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors mb-6 group mr-2">
                    <ArrowLeft size={18} className="transition-transform group-hover:translate-x-1" />
                    <span className="text-[12px] font-black">العودة للرئيسية</span>
                </Link>

                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white p-10 relative overflow-hidden">

                    {/* Header */}
                    <div className="relative mb-10 text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-200 mx-auto mb-6 rotate-3">
                            <UserPlus size={30} className="text-white -rotate-3" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">ابدأ رحلتك</h1>
                        <p className="text-gray-400 text-[13px] font-bold mt-2">انضم لمجتمع "أخباركم" وكن أول من يعلم</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50/50 backdrop-blur-md border border-red-100 text-red-600 text-[12px] font-bold rounded-[20px] text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* حقل الاسم */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">الاسم الكامل</label>
                            <div className="relative group">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    placeholder="أحمد علي"
                                    className="w-full pr-12 pl-5 py-4 bg-gray-50/50 border border-gray-100 rounded-[22px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-bold text-gray-700"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* حقل الإيميل */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">البريد الإلكتروني</label>
                            <div className="relative group">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    placeholder="example@mail.com"
                                    className="w-full pr-12 pl-5 py-4 bg-gray-50/50 border border-gray-100 rounded-[22px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-bold text-gray-700"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* حقل الباسورد */}
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black text-gray-500 mr-2 uppercase tracking-widest">كلمة المرور</label>
                            <div className="relative group">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pr-12 pl-5 py-4 bg-gray-50/50 border border-gray-100 rounded-[22px] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-bold text-gray-700"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-[22px] font-black text-[15px] flex items-center justify-center gap-3 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={22} /> : "إنشاء الحساب الآن"}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-gray-400 text-[13px] font-bold">
                            عضو سابق؟{" "}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-black transition-colors underline-offset-4 hover:underline">تسجيل الدخول</Link>
                        </p>
                    </div>
                </div>

                {/* تذييل الصفحة */}
                <p className="text-center text-gray-400 text-[10px] mt-8 font-bold tracking-widest uppercase">
                    جميع الحقوق محفوظة © ٢٠٢٤ أخباركم بورتال
                </p>
            </div>
        </div>
    );
}