"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
    FilePlus2,
    MonitorPlay,
    Newspaper,
    Settings,
    LogOut,
    ExternalLink,
    LayoutDashboard,
    Bell,
    ChevronLeft
} from "lucide-react";

// استيراد الصفحات والمكونات
import AddNewsPage from "../add-news/page";
import AddAdPage from "../add-ad/page";
import ManageNews from "@/components/admin/ManageNews";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("manage");

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex text-right" dir="rtl">

            {/* 1. القائمة الجانبية (Sidebar) بتصميم عصري */}
            <aside className="w-80 bg-[#1E293B] flex flex-col sticky top-0 h-screen shadow-2xl z-50">
                {/* Logo Area */}
                <div className="p-8 mb-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform">
                            <Settings className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-black tracking-tight">أخباركم</h2>
                            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">لوحة التحكم</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    <p className="text-[10px] font-black text-slate-500 px-4 mb-4 uppercase tracking-[0.15em]">التحكم المحتوى</p>

                    <button
                        onClick={() => setActiveTab("manage")}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeTab === "manage"
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard size={20} className={activeTab === "manage" ? "text-white" : "text-slate-500"} />
                            <span className="font-bold text-sm">إدارة المنشورات</span>
                        </div>
                        <ChevronLeft size={14} className={`transition-transform ${activeTab === "manage" ? "opacity-100" : "opacity-0"}`} />
                    </button>

                    <button
                        onClick={() => setActiveTab("news")}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeTab === "news"
                                ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <FilePlus2 size={20} className={activeTab === "news" ? "text-white" : "text-slate-500"} />
                            <span className="font-bold text-sm">إضافة خبر جديد</span>
                        </div>
                        <ChevronLeft size={14} className={`transition-transform ${activeTab === "news" ? "opacity-100" : "opacity-0"}`} />
                    </button>

                    <div className="pt-8">
                        <p className="text-[10px] font-black text-slate-500 px-4 mb-4 uppercase tracking-[0.15em]">الإعلانات</p>
                        <button
                            onClick={() => setActiveTab("ads")}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeTab === "ads"
                                    ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <MonitorPlay size={20} className={activeTab === "ads" ? "text-white" : "text-slate-500"} />
                                <span className="font-bold text-sm">إدارة الإعلانات</span>
                            </div>
                            <ChevronLeft size={14} className={`transition-transform ${activeTab === "ads" ? "opacity-100" : "opacity-0"}`} />
                        </button>
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="p-6 space-y-3">
                    <Link
                        href="/"
                        className="flex items-center gap-3 p-4 text-slate-400 font-bold hover:bg-slate-800 rounded-2xl transition-all border border-slate-700/50"
                    >
                        <ExternalLink size={18} />
                        <span className="text-sm">معاينة الموقع</span>
                    </Link>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })} // <--- أضف هذا الأكشن
                        className="w-full flex items-center gap-3 p-4 text-rose-400 font-bold hover:bg-rose-500/10 rounded-2xl transition-all"
                    >
                        <LogOut size={18} />
                        <span className="text-sm">تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* 2. منطقة المحتوى (Main Content) */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-10 flex items-center justify-between shrink-0 z-40">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">
                            {activeTab === "news" && "نشر محتوى جديد"}
                            {activeTab === "manage" && "لوحة التحكم الرئيسية"}
                            {activeTab === "ads" && "المساحات الإعلانية"}
                        </h3>
                        <p className="text-xs text-slate-400 font-bold mt-1">لوحة إدارة نظام أخباركم الذكي</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 text-slate-400 hover:bg-gray-100 rounded-xl transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 left-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-black text-slate-800">أدمن النظام</p>
                                <p className="text-[10px] text-blue-500 font-bold">مدير كامل الصلاحيات</p>
                            </div>
                            <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Scrolling Area */}
                <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-100 min-h-[600px]">
                            {activeTab === "news" && <AddNewsPage />}
                            {activeTab === "manage" && <ManageNews />}
                            {activeTab === "ads" && <AddAdPage />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}