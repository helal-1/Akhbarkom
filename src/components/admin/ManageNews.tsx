"use client";
import { useEffect, useState } from "react";
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

    const fetchContent = async () => {
        setLoading(true);
        const table = activeTab === "news" ? "articles" : "sidebar_ads";
        const orderBy = activeTab === "news" ? "created_at" : "priority";

        try {
            const { data: result, error } = await supabase
                .from(table)
                .select("*")
                .order(orderBy, { ascending: false });

            if (error) throw error;
            if (result) setData(result as UnifiedContent[]);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "فشل تحميل البيانات";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [activeTab]);

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        const table = activeTab === "news" ? "articles" : "sidebar_ads";

        try {
            const { error } = await supabase.from(table).delete().eq("id", deleteModal.id);
            if (error) throw error;

            setData((prev) => prev.filter((item) => item.id !== deleteModal.id));
            showToast("تم الحذف بنجاح", "success");
        } catch (error: unknown) {
            showToast("حدث خطأ أثناء الحذف", "error");
        }
        setDeleteModal({ show: false, id: null });
    };

    const filteredData = data.filter(item =>
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1500px] mx-auto pb-10 px-4 md:px-6" dir="rtl">

            {/* 1. Toast Alert - Responsive */}
            {toast.show && (
                <div className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-4 z-[500] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? "bg-green-600 border-green-400 text-white" : "bg-red-600 border-red-400 text-white"
                    }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-black text-sm md:text-base">{toast.message}</span>
                </div>
            )}

            {/* 2. Delete Modal - Responsive */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[600] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 max-w-md w-full shadow-2xl text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                            <Trash2 className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">تأكيد الحذف</h3>
                        <p className="text-gray-500 font-bold text-sm md:text-base mb-6 md:mb-8">هل أنت متأكد من حذف هذا المحتوى نهائياً؟</p>
                        <div className="flex gap-3 md:gap-4">
                            <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black hover:bg-red-700 transition-all text-sm md:text-base">نعم، احذف</button>
                            <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 bg-gray-100 text-gray-900 py-3 md:py-4 rounded-xl md:rounded-2xl font-black hover:bg-gray-200 transition-all text-sm md:text-base">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* أزرار التنقل - متجاوبة */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6 md:mb-10 bg-white p-2 md:p-3 rounded-[20px] md:rounded-[24px] border-2 border-gray-100 shadow-sm">
                <button
                    onClick={() => setActiveTab("news")}
                    className={`flex-1 flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all text-sm md:text-lg ${activeTab === "news" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <Newspaper size={20} className="md:w-6 md:h-6" /> الأخبار
                </button>
                <button
                    onClick={() => setActiveTab("ads")}
                    className={`flex-1 flex items-center justify-center gap-2 md:gap-3 px-4 py-3 md:py-4 rounded-xl md:rounded-2xl font-black transition-all text-sm md:text-lg ${activeTab === "ads" ? "bg-orange-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <Megaphone size={20} className="md:w-6 md:h-6" /> الإعلانات
                </button>
            </div>

            {/* أدوات البحث والتحديث */}
            <div className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[28px] shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="ابحث هنا..."
                        className="w-full pr-12 pl-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-sm md:text-xl text-black shadow-inner"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={fetchContent} className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-black hover:bg-black transition-all shadow-md active:scale-95 text-sm md:text-base">
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> تحديث
                </button>
            </div>

            {/* عرض المحتوى - جدول للكمبيوتر وكروت للموبايل */}
            <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
                {/* 1. نسخة الموبايل (Cards) - تظهر فقط في الشاشات الصغيرة */}
                <div className="block md:hidden divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-20 text-center"><RefreshCw className="animate-spin mx-auto text-blue-600" size={40} /></div>
                    ) : filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <div key={item.id} className="p-4 flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        <Image src={item.image_url || "/placeholder.png"} alt="" fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-black text-gray-900 text-base leading-tight mb-1 line-clamp-2">{item.title}</div>
                                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold">
                                            <Calendar size={12} />
                                            {new Date(item.created_at).toLocaleDateString('ar-EG')}
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === 'news' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {activeTab === 'news' ? item.category : `أولوية ${item.priority}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <a href={activeTab === "news" ? `/news/${item.slug}` : item.link_url} target="_blank" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-black border border-gray-100">
                                        {activeTab === "news" ? <Eye size={16} /> : <ExternalLink size={16} />} عرض
                                    </a>
                                    <button onClick={() => setDeleteModal({ show: true, id: item.id })} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg text-xs font-black border border-red-100">
                                        <Trash2 size={16} /> حذف
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-10 text-center text-gray-400 font-bold">لا يوجد نتائج</div>
                    )}
                </div>

                {/* 2. نسخة الكمبيوتر (Table) - تختفي في الموبايل */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className={`${activeTab === "news" ? "bg-blue-600" : "bg-orange-600"} text-white`}>
                                <th className="p-6 font-black text-lg">المحتوى</th>
                                <th className="p-6 font-black text-lg text-center">التصنيف / الأولوية</th>
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
                                                <div className="relative w-24 h-20 rounded-[20px] overflow-hidden shrink-0 border-2 border-gray-200 shadow-sm">
                                                    <Image src={item.image_url || "/placeholder.png"} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                                </div>
                                                <div>
                                                    <div className="font-black text-gray-900 text-xl leading-tight mb-1 line-clamp-1">{item.title}</div>
                                                    <div className="text-gray-400 text-xs font-bold">{new Date(item.created_at).toLocaleDateString('ar-EG', { dateStyle: 'long' })}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {activeTab === "news" ? (
                                                <span className="bg-blue-50 text-blue-700 px-5 py-2 rounded-xl text-sm font-black border border-blue-100">{item.category}</span>
                                            ) : (
                                                <span className="bg-orange-50 text-orange-700 px-5 py-2 rounded-xl text-sm font-black border border-orange-100">أولوية: {item.priority}</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-center gap-4">
                                                <a href={activeTab === "news" ? `/news/${item.slug}` : item.link_url} target="_blank" className="p-4 bg-gray-50 text-gray-700 hover:bg-black hover:text-white rounded-2xl transition-all border border-gray-100">
                                                    {activeTab === "news" ? <Eye size={24} /> : <ExternalLink size={24} />}
                                                </a>
                                                <button onClick={() => setDeleteModal({ show: true, id: item.id })} className="p-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all border border-red-50">
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-32 text-center">
                                        <Newspaper size={80} className="mx-auto text-gray-100 mb-4" />
                                        <p className="text-gray-400 font-black text-2xl">لم يتم العثور على أي نتائج..</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}