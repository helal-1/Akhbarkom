"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PlusSquare, Search, Bell, Menu, LogIn, User, Loader2, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useSession, signOut } from "next-auth/react";

interface ArticleSearchResult {
    id: string;
    title: string;
    category: string;
    created_at: string;
}

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ArticleSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // منطق البحث (موجود كما هو)
    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            const { data } = await supabase
                .from("articles")
                .select("id, title, category, created_at")
                .ilike("title", `%${query}%`)
                .limit(5);

            setResults((data as ArticleSearchResult[]) || []);
            setIsSearching(false);
        };

        const timer = setTimeout(fetchResults, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const isActive = (path: string) => pathname === path;

    // --- تعديل الـ Admin لضمان الظهور ---
    const user = session?.user as any;
    const isAdmin = user?.role?.toLowerCase() === "admin";

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 h-[70px] flex items-center transition-all duration-300" dir="rtl">
            <div className="max-w-[1550px] mx-auto w-full px-4 flex items-center justify-between gap-2">

                {/* --- اليمين: اللوجو --- */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-transform group-hover:scale-105">
                            <Image src="/logo.png" alt="لوجو" fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex flex-col hidden sm:flex">
                            <span className="text-blue-600 text-lg font-black leading-none">أخباركم</span>
                            <span className="text-[8px] text-gray-400 font-bold tracking-widest">PORTAL</span>
                        </div>
                    </Link>
                </div>

                {/* --- الوسط: الروابط القائمة --- */}
                <div className="hidden lg:flex items-center justify-center bg-gray-100/60 p-1 rounded-2xl border border-gray-100/50 mx-2 overflow-hidden">
                    {[
                        { name: "الرئيسية", href: "/" },
                        { name: "سياسة", href: "/category/politics" },
                        { name: "رياضة", href: "/category/sports" },
                        { name: "اقتصاد", href: "/category/economy" },
                        { name: "صحة", href: "/category/health" },
                        { name: "عاجل", href: "/category/urgent" },
                        { name: "حوادث", href: "/category/Accidents" },
                        { name: "شخصيات", href: "/category/Characters" },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 xl:px-5 py-2 rounded-xl transition-all duration-300 font-black text-[12px] xl:text-[13px] whitespace-nowrap ${isActive(link.href)
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-blue-500 hover:bg-white/50"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* --- اليسار: البحث والأزرار --- */}
                <div className="flex items-center justify-end gap-3 shrink-0">

                    {/* البحث */}
                    <div className="hidden xl:block relative">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border ${isFocused ? "bg-white border-blue-400 w-[250px] shadow-lg" : "bg-gray-100 border-transparent w-[180px]"}`}>
                            <Search size={16} className={isFocused ? "text-blue-600" : "text-gray-400"} />
                            <input
                                type="text"
                                value={query}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="ابحث عن خبر..."
                                className="bg-transparent outline-none text-[12px] font-bold text-gray-700 w-full"
                            />
                            {isSearching && <Loader2 size={14} className="animate-spin text-blue-500" />}
                        </div>
                        {query.length >= 2 && isFocused && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-[300px] z-50">
                                {results.length > 0 ? (
                                    results.map((article) => (
                                        <Link key={article.id} href={`/news/${article.id}`} className="block p-3 hover:bg-blue-50 text-[12px] font-bold text-gray-700 border-b last:border-0 transition-colors">
                                            {article.title}
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-400 text-[11px]">لا توجد نتائج</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* زرار نشر خبر للأدمن فقط */}
                    {isAdmin && (
                        <Link
                            href="/admin/dashboard"
                            className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                        >
                            <PlusSquare size={16} />
                            <span>نشر خبر</span>
                        </Link>
                    )}

                    {/* التنبيهات */}
                    {/* {session && (
                        <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 cursor-pointer transition-all relative group">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>
                    )} */}

                    {/* البروفايل والقائمة المنسدلة */}
                    <div className="relative">
                        {status === "loading" ? (
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl">
                                <Loader2 size={18} className="animate-spin text-blue-600" />
                            </div>
                        ) : session ? (
                            <div className="relative group">
                                <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-all border border-blue-100 shadow-sm">
                                    <User size={18} />
                                </button>

                                <div className="absolute left-0 mt-2 w-64 bg-white rounded-[24px] shadow-2xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-[60]">
                                    <div className="px-5 py-3 border-b border-gray-50 mb-2">
                                        <p className="text-[13px] font-black text-gray-900 leading-tight">{user?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{user?.email}</p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg border border-blue-100 uppercase">
                                            {isAdmin ? "مدير الموقع" : "مستخدم"}
                                        </span>
                                    </div>

                                    {/* روابط إضافية تظهر للأدمن داخل القائمة */}
                                    {isAdmin && (
                                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                            <LayoutDashboard size={16} className="text-gray-400" />
                                            <span className="text-[11px] font-black">لوحة التحكم</span>
                                        </Link>
                                    )}

                                    {/* <button className="w-full flex items-center gap-3 px-5 py-2.5 text-gray-600 hover:bg-blue-50 transition-all">
                                        <Bell size={16} className="text-gray-400" />
                                        <span className="text-[11px] font-black">إعدادات التنبيهات</span>
                                    </button> */}

                                    <div className="mt-2 pt-2 border-t border-gray-50 px-2">
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <LogOut size={16} />
                                            <span className="text-[11px] font-black">تسجيل الخروج</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                                <LogIn size={16} />
                                <span>دخول</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}