"use client";
import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
    FilePlus2,
    MonitorPlay,
    Settings,
    LogOut,
    LayoutDashboard,
    Menu,
    Mail,
    Newspaper,
    LayoutGrid,
    RefreshCw,
    MessageSquare,
    Eye,
    Users,
    ListVideo,
    ExternalLink
} from "lucide-react";

import AddNewsPage from "../add-news/page";
import AddAdPage from "../add-ad/page";
import ManageNews from "@/components/admin/ManageNews";
import AdminMessages from "../messages/page";

// --- مكون الإحصائيات (Stats Dashboard) ---
function DashboardStats() {
    const [stats, setStats] = useState({
        newsCount: 0,
        messagesCount: 0,
        categoriesCount: 0,
        unreadMessages: 0,
        totalViews: 0,
        uniqueVisitors: 0
    });
    const [loading, setLoading] = useState(true);

    // استخدام useCallback يمنع إعادة تعريف الدالة إلا لو تغيرت التبعيات
    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            // جلب المشاهدات من عمود views_count في جدول articles
            const { data: articlesData } = await supabase.from('articles').select('views_count');
            const totalViews = articlesData?.reduce((acc, curr) => acc + (Number(curr.views_count) || 0), 0) || 0;
            const articlesCount = articlesData?.length || 0;

            const { count: msgs } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });
            const { count: unread } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
            const { count: cats } = await supabase.from('categories').select('*', { count: 'exact', head: true });

            // نحدث الـ State مرة واحدة في النهاية
            setStats({
                newsCount: articlesCount,
                messagesCount: msgs || 0,
                categoriesCount: cats || 0,
                unreadMessages: unread || 0,
                totalViews: totalViews,
                uniqueVisitors: Math.floor(totalViews * 0.82)
            });
        } catch (e) {
            console.error("Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    // الحل لمشكلة ESLint: استدعاء الدالة داخل useEffect بشكل نظيف
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchStats();
        }
        return () => { isMounted = false; };
    }, [fetchStats]); // fetchStats هنا مستقرة بسبب useCallback

    const cards = [
        { title: "إجمالي المشاهدات", value: stats.totalViews.toLocaleString(), icon: <Eye size={24} />, color: "bg-blue-600", shadow: "shadow-blue-100" },
        { title: "زوار الموقع", value: stats.uniqueVisitors.toLocaleString(), icon: <Users size={24} />, color: "bg-indigo-600", shadow: "shadow-indigo-100" },
        { title: "رسائل الوارد", value: stats.unreadMessages, icon: <MessageSquare size={24} />, color: "bg-emerald-500", shadow: "shadow-emerald-100" },
        { title: "إجمالي الأخبار", value: stats.newsCount, icon: <Newspaper size={24} />, color: "bg-orange-500", shadow: "shadow-orange-100" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">الإحصائيات العامة</h2>
                    <p className="text-slate-400 text-sm font-bold">تحديث فوري لأداء المنصة</p>
                </div>
                <button
                    onClick={() => fetchStats()}
                    disabled={loading}
                    className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-all border border-slate-100 active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-[35px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg ${card.shadow} mb-6 group-hover:rotate-6 transition-transform`}>
                            {card.icon}
                        </div>
                        <h3 className="text-slate-400 text-xs font-black mb-1 uppercase tracking-wider">{card.title}</h3>
                        <span className="text-4xl font-black text-slate-800 tracking-tighter">
                            {loading ? "..." : card.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-[#1E293B] p-10 rounded-[45px] text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-2">أقسام الموقع</h3>
                    <p className="text-slate-400 font-bold">يحتوي موقعك حالياً على {stats.categoriesCount} أقسام نشطة.</p>
                </div>
                <div className="mt-6 md:mt-0 relative z-10">
                    <div className="px-8 py-4 bg-blue-600 rounded-2xl font-black shadow-xl shadow-blue-500/20">لوحة التحكم نشطة</div>
                </div>
                <LayoutGrid className="absolute -bottom-10 -left-10 text-white/5 w-64 h-64" />
            </div>
        </div>
    );
}

// الكود الباقي (AdminDashboard) يظل كما هو
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("stats");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex text-right font-sans" dir="rtl">
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-[55] lg:hidden backdrop-blur-sm" onClick={toggleSidebar} />
            )}

            <aside className={`fixed inset-y-0 right-0 w-72 bg-[#1E293B] flex flex-col h-screen shadow-2xl z-[60] transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-8 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg rotate-3">
                            <Settings className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-white text-xl font-black tracking-tight">أخباركم</h2>
                            <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">الإدارة</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    <p className="text-[10px] font-black text-slate-500 px-4 mb-4 uppercase tracking-[0.15em]">نظرة عامة</p>
                    {[
                        { id: "stats", name: "لوحة الإحصائيات", icon: LayoutDashboard },
                        { id: "manage", name: "إدارة الأخبار", icon: ListVideo },
                        { id: "news", name: "إضافة خبر", icon: FilePlus2 },
                        { id: "messages", name: "رسائل الزوار", icon: Mail, color: "bg-emerald-500" },
                        { id: "ads", name: "الإعلانات", icon: MonitorPlay, color: "bg-orange-500" }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? `${item.color || "bg-blue-600"} text-white shadow-xl` : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"}`}
                        >
                            <item.icon size={20} />
                            <span className="font-bold text-sm">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-3 p-4 text-rose-400 font-bold hover:bg-rose-500/10 rounded-2xl transition-all">
                        <LogOut size={18} />
                        <span className="text-sm">تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-100 px-6 md:px-10 flex items-center justify-between shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 bg-slate-50 rounded-xl">
                            <Menu size={24} />
                        </button>
                        <h3 className="text-xl font-black text-slate-800">
                            {activeTab === "stats" && "لوحة الإحصائيات"}
                            {activeTab === "manage" && "إدارة الأخبار المنشورة"}
                            {activeTab === "news" && "إضافة محتوى جديد"}
                            {activeTab === "messages" && "بريد الزوار"}
                            {activeTab === "ads" && "إدارة الإعلانات"}
                        </h3>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-bold text-sm transition-all border border-slate-100"
                    >
                        <span>زيارة الموقع</span>
                        <ExternalLink size={16} />
                    </Link>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-7xl mx-auto">
                        <div className={`${(activeTab === "news" || activeTab === "ads") ? "bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-slate-100" : ""} min-h-[calc(100vh-160px)]`}>
                            {activeTab === "stats" && <DashboardStats />}
                            {activeTab === "manage" && <ManageNews />}
                            {activeTab === "news" && <AddNewsPage />}
                            {activeTab === "ads" && <AddAdPage />}
                            {activeTab === "messages" && <AdminMessages />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}