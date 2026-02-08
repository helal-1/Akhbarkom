"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    PlusSquare, Search, LogIn, User,
    Loader2, LogOut, LayoutDashboard, ChevronDown
} from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { useSession, signOut } from "next-auth/react";

interface ArticleSearchResult {
    id: string;
    title: string;
    category: string;
}

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ArticleSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: "الرئيسية", href: "/" },
        { name: "عاجل", href: "/category/urgent" },
        { name: "سياسة", href: "/category/politics" },
        { name: "رياضة", href: "/category/sports" },
        { name: "اقتصاد", href: "/category/economy" },
        { name: "صحة", href: "/category/health" },
        { name: "حوادث", href: "/category/Accidents" },
        { name: "شخصيات", href: "/category/Characters" },
    ];

    // إغلاق القوائم عند الضغط خارجها
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) { setResults([]); return; }
            setIsSearching(true);
            const { data } = await supabase.from("articles").select("id, title, category").ilike("title", `%${query}%`).limit(5);
            setResults((data as ArticleSearchResult[]) || []);
            setIsSearching(false);
        };
        const timer = setTimeout(fetchResults, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const user = session?.user as any;
    const isAdmin = user?.role?.toLowerCase() === "admin";

    const handleResultClick = (id: string) => {
        setQuery("");
        setIsFocused(false);
        router.push(`/news/${id}`);
    };

    // مكون نتائج البحث
    const SearchResults = ({ isMobile = false }) => (
        (isFocused && query.length >= 2) ? (
            <div className={`absolute ${isMobile ? 'top-[45px] inset-x-0' : 'top-[42px] left-0 w-[320px]'} bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[999]`}>
                {results.length > 0 ? (
                    results.map((article) => (
                        <div
                            key={article.id}
                            onMouseDown={(e) => { e.preventDefault(); handleResultClick(article.id); }}
                            className="p-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 cursor-pointer transition-colors"
                        >
                            <p className="text-[13px] font-black text-gray-900 line-clamp-1 italic">{article.title}</p>
                            <span className="text-[10px] text-blue-500 font-bold">{article.category}</span>
                        </div>
                    ))
                ) : !isSearching && (
                    <div className="p-4 text-center text-gray-400 text-xs font-bold">لا توجد نتائج بحث</div>
                )}
            </div>
        ) : null
    );

    return (
        <nav className="bg-white sticky top-0 z-[60] border-b border-gray-100" dir="rtl">
            <div className="max-w-[1550px] mx-auto px-4">

                {/* --- الصف الرئيسي (Desktop & Mobile Top) --- */}
                <div className="h-[55px] md:h-[70px] flex items-center justify-between gap-4">

                    {/* اليمين: اللوجو */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <Image src="/logo.png" alt="لوجو" fill className="object-cover" unoptimized />
                        </div>
                        <span className="text-blue-600 text-xl font-black hidden xs:block tracking-tighter">أخباركم</span>
                    </Link>

                    {/* الوسط: روابط الديسكتوب فقط */}
                    <div className="hidden lg:flex items-center bg-gray-100/60 p-1 rounded-2xl border border-gray-100/50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl font-black text-[13px] transition-all ${pathname === link.href ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-blue-600"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* اليسار: البحث + البروفايل */}
                    <div className="flex items-center gap-2 md:gap-3">

                        {/* بحث الديسكتوب */}
                        <div className="hidden lg:block relative">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${isFocused ? "bg-white border-blue-400 w-[260px] shadow-md" : "bg-gray-50 border-transparent w-[180px]"}`}>
                                <Search size={16} className={isFocused ? "text-blue-600" : "text-gray-500"} />
                                <input
                                    type="text"
                                    value={query}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="بحث في الأخبار..."
                                    className="bg-transparent text-gray-900 placeholder:text-gray-500 outline-none text-[14px] font-bold w-full"
                                />
                                {isSearching && <Loader2 size={14} className="animate-spin text-blue-500" />}
                            </div>
                            <SearchResults />
                        </div>

                        {/* زر لوحة التحكم للإدمن (Desktop) */}
                        {isAdmin && (
                            <Link href="/admin/dashboard" className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-blue-700 shadow-sm">
                                <PlusSquare size={16} />
                                <span>نشر خبر</span>
                            </Link>
                        )}

                        {/* قائمة المستخدم (User Menu) */}
                        {session ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-1 p-1 pr-2 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all"
                                >
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* المنيو المنسدل */}
                                {showUserMenu && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-[1000]">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-[10px] text-gray-400 font-bold">مرحباً بك</p>
                                            <p className="text-[12px] text-gray-900 font-black truncate">{user?.name || 'مستخدم'}</p>
                                        </div>
                                        {isAdmin && (
                                            <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-[12px] font-black text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                                <LayoutDashboard size={14} /> لوحة التحكم
                                            </Link>
                                        )}
                                      
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-black text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={14} /> تسجيل الخروج
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-[12px] font-black hover:bg-black transition-all">
                                <LogIn size={16} />
                                <span className="hidden sm:inline">دخول</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* --- الصف السفلي (Mobile Only < lg) --- */}
            <div className="lg:hidden bg-white border-t border-gray-50 py-2 pb-3 shadow-sm">
                <div className="px-4 space-y-3">
                    {/* البحث في الموبايل */}
                    <div className="relative">
                        <div className="relative flex items-center">
                            <Search className="absolute right-3 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={query}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="ابحث عن خبر أو موضوع..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pr-10 pl-4 text-[14px] font-bold text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:border-blue-300 transition-all"
                            />
                            {isSearching && <Loader2 size={14} className="absolute left-3 animate-spin text-blue-500" />}
                        </div>
                        <SearchResults isMobile />
                    </div>

                    {/* الأقسام (Chips) */}
                    <div className="flex overflow-x-auto no-scrollbar gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`shrink-0 px-4 py-1.5 rounded-lg text-[11px] font-black transition-all border ${pathname === link.href
                                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                                        : "bg-white border-gray-100 text-gray-500 shadow-sm"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </nav>
    );
}