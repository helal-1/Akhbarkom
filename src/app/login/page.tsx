"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

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
            setError("خطأ في البريد أو كلمة المرور");
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6" dir="rtl">
            <div className="max-w-[450px] w-full bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">

                <div className="bg-blue-600 p-10 text-center relative">
                    <Link href="/" className="relative z-10 inline-flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                            <Image src="/logo.png" alt="أخباركم" width={40} height={40} />
                        </div>
                        <span className="text-white text-2xl font-black mt-2">أخباركم</span>
                    </Link>
                </div>

                <div className="p-10">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">مرحباً بك مجدداً</h2>
                    <p className="text-gray-400 text-[13px] font-bold mb-8">اختر طريقة الدخول المفضلة لك</p>

                    {error && <p className="text-red-500 font-bold text-sm mb-4 bg-red-50 p-2 rounded-lg text-center">{error}</p>}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 mr-2">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@mail.com"
                                    className="w-full bg-gray-50 border-2 border-transparent p-4 pr-12 rounded-2xl font-bold text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 mr-2">كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border-2 border-transparent p-4 pr-12 rounded-2xl font-bold text-sm focus:bg-white focus:border-blue-600 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>دخول <LogIn size={20} /></>}
                        </button>
                    </form>

                    {/* --- فاصل "أو عبر" --- */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-gray-400 font-black">أو عبر</span>
                        </div>
                    </div>

                    {/* --- أزرار جوجل وفيسبوك --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="flex items-center justify-center gap-2 py-3 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 hover:border-gray-100 transition-all font-black text-[12px] text-gray-700"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span>جوجل</span>
                        </button>

                        <button
                            onClick={() => signIn("facebook", { callbackUrl: "/" })}
                            className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] text-white rounded-2xl hover:bg-blue-700 transition-all font-black text-[12px]"
                        >
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Facebook" />
                            <span>فيسبوك</span>
                        </button>
                    </div>

                    <p className="text-center mt-8 text-gray-400 text-xs font-bold">
                        ليس لديك حساب؟ <Link href="/register" className="text-blue-600 hover:underline">سجل الآن</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}