"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Trash2, Eye, RefreshCw, Search, Newspaper,
    Megaphone, ExternalLink, X, CheckCircle2, AlertCircle
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

    // حالات التنبيه والنافذة المنبثقة
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

    useEffect(() => {
        let isMounted = true;
        async function fetchContent() {
            setLoading(true);
            const table = activeTab === "news" ? "articles" : "sidebar_ads";
            const orderBy = activeTab === "news" ? "created_at" : "priority";

            const { data: result, error } = await supabase
                .from(table)
                .select("*")
                .order(orderBy, { ascending: false });

            if (isMounted && !error && result) {
                setData(result as UnifiedContent[]);
            }
            if (isMounted) setLoading(false);
        }
        fetchContent();
        return () => { isMounted = false; };
    }, [activeTab]);

    const handleManualRefresh = () => {
        setLoading(true);
        const table = activeTab === "news" ? "articles" : "sidebar_ads";
        const orderBy = activeTab === "news" ? "created_at" : "priority";

        supabase.from(table).select("*").order(orderBy, { ascending: false })
            .then(({ data: result }) => {
                if (result) setData(result as UnifiedContent[]);
                setLoading(false);
                showToast("تم تحديث البيانات", "success");
            });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;

        const table = activeTab === "news" ? "articles" : "sidebar_ads";
        const { error } = await supabase.from(table).delete().eq("id", deleteModal.id);

        if (!error) {
            setData((prev) => prev.filter((item) => item.id !== deleteModal.id));
            showToast("تم الحذف بنجاح", "success");
        } else {
            showToast("فشل الحذف، حاول مجدداً", "error");
        }
        setDeleteModal({ show: false, id: null });
    };

    const filteredData = data.filter(item =>
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-[1500px] mx-auto pb-10 px-6" dir="rtl">

            {/* 1. التنبيه العائم (Toast) */}
            {toast.show && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[200] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? "bg-green-600 border-green-400 text-white" : "bg-red-600 border-red-400 text-white"
                    }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-black">{toast.message}</span>
                </div>
            )}

            {/* 2. نافذة تأكيد الحذف (Custom Confirm Modal) */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border-2 border-gray-100 text-center">
                        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">تأكيد الحذف النهائي</h3>
                        <p className="text-gray-500 font-bold mb-8">هل أنت متأكد؟ لا يمكن التراجع عن هذه الخطوة بعد التنفيذ.</p>
                        <div className="flex gap-4">
                            <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition-all">نعم، احذف</button>
                            <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}

            {/* أزرار التنقل */}
            <div className="flex gap-4 mb-10 bg-white p-3 rounded-[24px] w-fit mx-auto border-2 border-gray-200 shadow-sm">
                <button
                    onClick={() => setActiveTab("news")}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all ${activeTab === "news" ? "bg-blue-600 text-white shadow-xl scale-105" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <Newspaper size={24} /> الأخبار المنشورة
                </button>
                <button
                    onClick={() => setActiveTab("ads")}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black transition-all ${activeTab === "ads" ? "bg-orange-600 text-white shadow-xl scale-105" : "text-gray-500 hover:bg-gray-50"}`}
                >
                    <Megaphone size={24} /> الإعلانات النشطة
                </button>
            </div>

            {/* أدوات التحكم */}
            <div className="bg-white p-6 rounded-[28px] shadow-sm border-2 border-gray-200 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="relative flex-1">
                    <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                    <input
                        type="text"
                        placeholder={`ابحث عن ${activeTab === "news" ? "خبر..." : "إعلان..."}`}
                        className="w-full pr-14 pl-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-xl text-gray-900 shadow-inner"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={handleManualRefresh} className="flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all shadow-lg active:scale-95">
                    <RefreshCw size={24} className={loading ? "animate-spin" : ""} /> تحديث القائمة
                </button>
            </div>

            {/* الجدول */}
            <div className="bg-white rounded-[32px] shadow-sm border-2 border-gray-200 overflow-hidden">
                <table className="w-full text-right">
                    <thead>
                        <tr className={`${activeTab === "news" ? "bg-blue-600" : "bg-orange-600"} text-white`}>
                            <th className="p-6 font-black text-lg">المحتوى</th>
                            <th className="p-6 font-black text-lg text-center">التصنيف / الأولوية</th>
                            <th className="p-6 font-black text-lg text-center">التحكم</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100">
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
                                            <a href={activeTab === "news" ? `/news/${item.slug}` : item.link_url} target="_blank" className="p-4 bg-gray-100 text-gray-700 hover:bg-black hover:text-white rounded-2xl transition-all border-2 border-transparent">
                                                {activeTab === "news" ? <Eye size={24} /> : <ExternalLink size={24} />}
                                            </a>
                                            <button onClick={() => setDeleteModal({ show: true, id: item.id })} className="p-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all border-2 border-red-50">
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
    );
}