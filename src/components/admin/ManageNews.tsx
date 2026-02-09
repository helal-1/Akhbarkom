"use client";
import { useEffect, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Trash2, Eye, RefreshCw, Search, Newspaper,
    Megaphone, ExternalLink, CheckCircle2, AlertCircle, Calendar
} from "lucide-react";
import Image from "next/image";

interface UnifiedContent {
    id: string;
    title: string;
    image_url: string;
    created_at: string;
    category?: string;
    author_name?: string;
    slug?: string;
    priority?: number;
    expires_at?: string | null;
    link_url?: string;
    placements?: string[];
}

export default function ManageContent() {
    const [activeTab, setActiveTab] = useState<"news" | "ads">("news");
    const [data, setData] = useState<UnifiedContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false, message: "", type: 'success'
    });
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: string | null }>({
        show: false, id: null
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === "news") {
                const { data: articles, error: fetchError } = await supabase
                    .from("articles")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (fetchError) throw fetchError;
                setData(articles as UnifiedContent[]);
            } else {
                const { data: ads, error: adsError } = await supabase
                    .from("ads")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (adsError) {
                    const { data: oldAds, error: oldError } = await supabase
                        .from("sidebar_ads")
                        .select("*")
                        .order("created_at", { ascending: false });
                    if (oldError) throw oldError;
                    setData((oldAds as UnifiedContent[]) || []);
                } else {
                    setData((ads as UnifiedContent[]) || []);
                }
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "فشل تحميل البيانات";
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        const table = activeTab === "news" ? "articles" : "ads";

        try {
            const { error: delError } = await supabase
                .from(table)
                .delete()
                .eq("id", deleteModal.id);

            if (delError) {
                if (activeTab === "ads") {
                    const { error: oldDelError } = await supabase
                        .from("sidebar_ads")
                        .delete()
                        .eq("id", deleteModal.id);
                    if (oldDelError) throw oldDelError;
                } else {
                    throw delError;
                }
            }

            setData((prev) => prev.filter((item) => item.id !== deleteModal.id));
            showToast("تم الحذف بنجاح", "success");
        } catch (err: unknown) {
            console.error("Delete Error:", err);
            showToast("فشل الحذف - تأكد من صلاحيات RLS", "error");
        } finally {
            setDeleteModal({ show: false, id: null });
        }
    };

    const filteredData = data.filter(item =>
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // دالة لتنظيف وتجهيز روابط الإعلانات
    const formatLink = (url?: string) => {
        if (!url) return "#";
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    const translatePlacement = (p: string) => {
        const map: Record<string, string> = {
            sidebar: "الجانبي",
            between_sections: "بين الأقسام",
            article_page: "داخل المقال",
            home_top: "أعلى الرئيسية"
        };
        return map[p] || p;
    };

    return (
        <div className="max-w-[1500px] mx-auto pb-10 px-4 md:px-6" dir="rtl">
            {/* Toast Notifications */}
            {toast.show && (
                <div className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-4 z-[500] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? "bg-green-600 border-green-400 text-white" : "bg-red-600 border-red-400 text-white"}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-black text-sm md:text-base">{toast.message}</span>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">تأكيد الحذف</h3>
                        <p className="text-gray-500 font-bold mb-8">هل أنت متأكد من حذف هذا المحتوى نهائياً؟</p>
                        <div className="flex gap-4">
                            <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition-all">نعم، احذف</button>
                            <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-3 rounded-[24px] border-2 border-gray-100 shadow-sm mt-6">
                <button onClick={() => setActiveTab("news")} className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded-2xl font-black transition-all text-lg ${activeTab === "news" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}>
                    <Newspaper size={24} /> الأخبار
                </button>
                <button onClick={() => setActiveTab("ads")} className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded-2xl font-black transition-all text-lg ${activeTab === "ads" ? "bg-orange-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}>
                    <Megaphone size={24} /> الإعلانات
                </button>
            </div>

            {/* Search Tools */}
            <div className="bg-white p-4 md:p-6 rounded-[28px] shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input type="text" placeholder="ابحث بالعنوان..." className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-xl text-black" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => fetchContent()} className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-md active:scale-95">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> تحديث القائمة
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className={`${activeTab === "news" ? "bg-blue-600" : "bg-orange-600"} text-white`}>
                                <th className="p-6 font-black text-lg">المحتوى</th>
                                <th className="p-6 font-black text-lg text-center">{activeTab === "news" ? "التصنيف" : "أماكن الظهور"}</th>
                                <th className="p-6 font-black text-lg text-center">التحكم</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={3} className="p-32 text-center"><RefreshCw className="animate-spin mx-auto text-blue-600" size={60} /></td></tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-6">
                                                <div className="relative w-24 h-20 rounded-[20px] overflow-hidden shrink-0 border-2 border-gray-200">
                                                    <Image src={item.image_url || "/placeholder.png"} alt="" fill className="object-cover" unoptimized />
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 text-xl line-clamp-1">{item.title}</div>
                                                    <div className="text-gray-400 text-xs font-bold flex items-center gap-1 mt-1">
                                                        <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString('ar-EG')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {activeTab === "news" ? (
                                                <span className="bg-blue-50 text-blue-700 px-5 py-2 rounded-xl text-sm font-black border border-blue-100">{item.category}</span>
                                            ) : (
                                                <div className="flex flex-wrap justify-center gap-1">
                                                    {item.placements?.map(p => (
                                                        <span key={p} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-[10px] font-black border border-orange-100">
                                                            {translatePlacement(p)}
                                                        </span>
                                                    )) || <span className="text-gray-400 italic text-sm">لا يوجد</span>}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-4">
                                                <a
                                                    href={activeTab === "news" ? `/news/${item.slug}` : formatLink(item.link_url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`p-4 rounded-2xl transition-all ${(!item.link_url && activeTab === "ads") ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-50 text-gray-700 hover:bg-black hover:text-white"}`}
                                                    onClick={(e) => { if (activeTab === "ads" && !item.link_url) { e.preventDefault(); showToast("لا يوجد رابط لهذا الإعلان", "error"); } }}
                                                >
                                                    {activeTab === "news" ? <Eye size={24} /> : <ExternalLink size={24} />}
                                                </a>
                                                <button onClick={() => setDeleteModal({ show: true, id: item.id })} className="p-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={3} className="p-32 text-center text-gray-400 font-black text-2xl">لا توجد نتائج</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {!loading && filteredData.map((item) => (
                        <div key={item.id} className="p-4 space-y-4">
                            <div className="flex gap-4">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                    <Image src={item.image_url || "/placeholder.png"} alt="" fill className="object-cover" unoptimized />
                                </div>
                                <div className="flex-1">
                                    <div className="font-black text-gray-900 text-sm line-clamp-2 mb-1">{item.title}</div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${activeTab === 'news' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {activeTab === 'news' ? item.category : 'إعلان'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a
                                    href={activeTab === "news" ? `/news/${item.slug}` : formatLink(item.link_url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl text-xs font-black"
                                >
                                    <Eye size={16} /> عرض
                                </a>
                                <button onClick={() => setDeleteModal({ show: true, id: item.id })} className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black">
                                    <Trash2 size={16} /> حذف
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}