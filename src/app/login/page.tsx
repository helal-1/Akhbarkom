"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, LogIn, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("عذراً، البريد أو كلمة المرور غير صحيحة");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
            {/* تأثيرات خلفية فنية */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[100px]" />

            <div className="max-w-[460px] w-full relative">
                {/* زر العودة */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all mb-6 group mr-2">
                    <ArrowLeft size={18} className="transition-transform group-hover:translate-x-1" />
                    <span className="text-[12px] font-black uppercase">العودة للرئيسية</span>
                </Link>

                <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden">

                    {/* الهيدر بتصميم أهدى */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-12 text-center relative">
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[24px] flex items-center justify-center border border-white/20 shadow-2xl">
                                <Image src="/logo.png" alt="أخباركم" width={45} height={45} className="brightness-110" />
                            </div>
                            <div>
                                <h1 className="text-white text-2xl font-black tracking-tight">مرحباً بك مجدداً</h1>
                                <p className="text-blue-200/60 text-[11px] font-bold mt-1 uppercase tracking-[0.2em]">أخباركم Portal</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-10">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[12px] font-bold rounded-[20px] flex items-center gap-2 animate-pulse">
                                <ShieldCheck size={16} />
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 mr-2 uppercase tracking-wider">البريد الإلكتروني</label>
                                <div className="relative group">
                                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@mail.com"
                                        className="w-full bg-gray-50/50 border border-gray-100 p-4 pr-12 rounded-[22px] font-bold text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-400 mr-2 uppercase tracking-wider">كلمة المرور</label>
                                <div className="relative group">
                                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50/50 border border-gray-100 p-4 pr-12 rounded-[22px] font-bold text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-gray-700"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-blue-600 text-white p-5 rounded-[22px] font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>تسجيل الدخول <LogIn size={18} /></>}
                            </button>
                        </form>

                        <div className="mt-10 text-center pt-6 border-t border-gray-50">
                            <p className="text-gray-400 text-[13px] font-bold">
                                ليس لديك حساب؟{" "}
                                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-black transition-colors">
                                    ابدأ الآن مجاناً
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-8 text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">
                    Secure Authentication System
                </p>
            </div>
        </main>
    );
}