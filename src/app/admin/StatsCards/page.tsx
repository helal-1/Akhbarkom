"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
    Newspaper,
    MessageCircle,
    Eye,
    TrendingUp,
    Users,
    ArrowUpRight,
    RefreshCw
} from "lucide-react";

export default function DashboardStats() {
    const [stats, setStats] = useState({
        newsCount: 0,
        messagesCount: 0,
        categoriesCount: 0,
        unreadMessages: 0,
        totalViews: 0,
        uniqueVisitors: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            // 1. جلب بيانات المقالات - نستخدم عمود views هنا
            const { data: articlesData, error: articlesError } = await supabase
                .from('articles')
                .select('views, category'); // تأكدنا إن الاسم views

            if (articlesError) throw articlesError;

            // حساب إجمالي المشاهدات من عمود views
            const totalViews = articlesData?.reduce((acc, curr) => {
                // تحويل القيمة لرقم والتأكد إنها مش Null
                return acc + (Number(curr.views) || 0);
            }, 0) || 0;

            const articlesCount = articlesData?.length || 0;

            // حساب عدد الأقسام بناءً على القيم الموجودة في المقالات
            const uniqueCategories = new Set(articlesData?.map(a => a.category).filter(Boolean));
            const categoriesCount = uniqueCategories.size;

            // 2. جلب إحصائيات الرسائل (لو الجدول موجود)
            const { count: msgs } = await supabase
                .from('contact_messages')
                .select('*', { count: 'exact', head: true });

            setStats({
                newsCount: articlesCount,
                messagesCount: msgs || 0,
                categoriesCount: categoriesCount,
                unreadMessages: 0,
                totalViews, // القيمة اللي اتجمعت من عمود views
                uniqueVisitors: Math.floor(totalViews * 0.85) // حسبة تقديرية للزوار
            });

        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const cards = [
        { title: "إجمالي المشاهدات", value: stats.totalViews.toLocaleString(), icon: <Eye size={24} />, color: "bg-blue-600", shadow: "shadow-blue-100", trend: "تفاعل حقيقي", change: "+12%" },
        { title: "الزوار الفريدون", value: stats.uniqueVisitors.toLocaleString(), icon: <Users size={24} />, color: "bg-indigo-600", shadow: "shadow-indigo-100", trend: "زائر للموقع", change: "+5%" },
        { title: "رسائل الوارد", value: stats.messagesCount, icon: <MessageCircle size={24} />, color: "bg-emerald-500", shadow: "shadow-emerald-100", trend: `${stats.unreadMessages} غير مقروء`, change: "جديد" },
        { title: "المحتوى المنشور", value: stats.newsCount, icon: <Newspaper size={24} />, color: "bg-orange-500", shadow: "shadow-orange-100", trend: `${stats.categoriesCount} أقسام`, change: "نشط" }
    ];

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-44 bg-white border border-slate-100 rounded-[32px] animate-pulse shadow-sm"></div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-black text-slate-800">الأداء العام</h2>
                <button onClick={fetchStats} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-blue-600 border border-transparent hover:border-slate-100 shadow-sm">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" dir="rtl">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${card.color}`}></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg ${card.shadow} transform group-hover:rotate-6 transition-transform`}>
                                {card.icon}
                            </div>
                            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-[10px] font-black">
                                <ArrowUpRight size={14} /> {card.change}
                            </div>
                        </div>
                        <div className="mt-6 relative z-10">
                            <h3 className="text-slate-400 text-xs font-black mb-1 uppercase tracking-wider">{card.title}</h3>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-slate-800 tracking-tight">{card.value}</span>
                                <span className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                                    <TrendingUp size={12} className="text-blue-500" /> {card.trend}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}