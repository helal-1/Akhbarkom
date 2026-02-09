"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    ImagePlus, Link as LinkIcon, Type, Send, X,
    CheckCircle2, LayoutList, Loader2, Megaphone,
    Calendar, AlertCircle, Layout
} from "lucide-react";

const PLACEMENT_OPTIONS = [
    { id: "sidebar", label: "السايدبار (الجانبي)" },
    { id: "between_sections", label: "بين الأقسام الرئيسية" },
    { id: "home_top", label: "أعلى الصفحة الرئيسية" },
    { id: "article_page", label: "داخل صفحة الخبر" },
];

export default function AddAdPage() {
    const [title, setTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [priority, setPriority] = useState("0");
    const [expiryDate, setExpiryDate] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedPlacements, setSelectedPlacements] = useState<string[]>(["sidebar"]);

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: "",
        type: 'success'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const handlePlacementChange = (id: string) => {
        setSelectedPlacements(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image || !title) {
            return showToast("الرجاء إضافة عنوان وصورة للإعلان أولاً", "error");
        }
        if (selectedPlacements.length === 0) {
            return showToast("يرجى اختيار مكان واحد على الأقل لظهور الإعلان", "error");
        }

        setLoading(true);
        try {
            const fileExt = image.name.split('.').pop();
            const fileName = `ad-${Date.now()}.${fileExt}`;
            const filePath = `ads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('news_images')
                .upload(filePath, image);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('news_images')
                .getPublicUrl(filePath);

            const { error: insertError } = await supabase
                .from('ads')
                .insert([{
                    title: title.trim(),
                    link_url: linkUrl.trim() || "#",
                    image_url: publicUrl,
                    priority: parseInt(priority) || 0,
                    expires_at: expiryDate || null,
                    is_active: true,
                    placements: selectedPlacements
                }]);

            if (insertError) throw insertError;

            showToast("تم تفعيل ونشر الإعلان بنجاح!", "success");
            setTitle("");
            setLinkUrl("");
            setPriority("0");
            setExpiryDate("");
            setSelectedPlacements(["sidebar"]);
            removeImage();

        } catch (err: unknown) {
            // حل مشكلة ESLint: التحقق من نوع الخطأ بدلاً من any
            console.error("Submission Error:", err);
            const errorMessage = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحفظ";
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10" dir="rtl">

            {/* Toast Alert */}
            {toast.show && (
                <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-auto px-6 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 z-[100] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? "bg-green-600 border-green-400 text-white" : "bg-red-600 border-red-400 text-white"
                    }`}>
                    <div className="flex items-center gap-3">
                        {toast.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        <span className="font-black">{toast.message}</span>
                    </div>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))}>
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-orange-50/50">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-4">
                        <div className="p-3 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-200">
                            <Megaphone size={32} />
                        </div>
                        إدارة حملة إعلانية
                    </h2>
                    <p className="text-gray-500 font-bold mt-4">قم بتحديد تفاصيل الإعلان وأماكن ظهوره على الموقع</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* أماكن الظهور */}
                    <div className="space-y-4">
                        <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <Layout size={20} className="text-orange-600" /> حدد أماكن ظهور الإعلان
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PLACEMENT_OPTIONS.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => handlePlacementChange(option.id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedPlacements.includes(option.id)
                                            ? "border-orange-600 bg-orange-50"
                                            : "border-gray-100 bg-gray-50 hover:border-gray-300"
                                        }`}
                                >
                                    <span className={`font-bold ${selectedPlacements.includes(option.id) ? "text-orange-700" : "text-gray-600"}`}>
                                        {option.label}
                                    </span>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlacements.includes(option.id) ? "bg-orange-600 border-orange-600" : "border-gray-300"
                                        }`}>
                                        {selectedPlacements.includes(option.id) && <CheckCircle2 size={16} className="text-white" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* عنوان الإعلان */}
                    <div className="space-y-3">
                        <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <Type size={18} className="text-orange-600" /> اسم النشاط أو عنوان الإعلان
                        </label>
                        <input
                            type="text"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-900 font-bold text-lg focus:border-orange-600 transition-all"
                            placeholder="مثلاً: عروض مطعم حضرموت..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                                <LinkIcon size={18} className="text-orange-600" /> رابط الواتساب أو الموقع
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-900 font-bold text-left focus:border-orange-600 transition-all"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                                <Calendar size={18} className="text-red-600" /> تاريخ انتهاء الإعلان
                            </label>
                            <input
                                type="date"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-900 font-black focus:border-red-600 transition-all"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* الترتيب */}
                    <div className="space-y-2">
                        <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <LayoutList size={18} className="text-orange-600" /> أولوية الترتيب (الأعلى يظهر أولاً)
                        </label>
                        <input
                            type="number"
                            className="w-40 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none text-gray-900 font-black text-lg focus:border-orange-600 transition-all"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </div>

                    {/* رفع الصورة */}
                    <div className="space-y-2">
                        <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <ImagePlus size={18} className="text-orange-600" /> تصميم الإعلان (البانر)
                        </label>
                        {!previewUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 p-16 rounded-[32px] text-center bg-gray-50 cursor-pointer hover:border-orange-600 hover:bg-orange-50/50 transition-all group"
                            >
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <ImagePlus className="text-gray-400 group-hover:text-orange-600" size={32} />
                                </div>
                                <p className="text-xl font-black text-gray-700">اضغط لرفع الصورة</p>
                                <p className="text-gray-400 font-bold mt-1">السايدبار يفضل مقاس طولي (مثلاً 800x1200)</p>
                            </div>
                        ) : (
                            <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-md">
                                <img src={previewUrl} alt="Preview" className="w-full max-h-[400px] object-contain mx-auto bg-gray-50" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-xl shadow-lg hover:bg-red-700 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-6 bg-orange-600 text-white font-black text-2xl rounded-2xl hover:bg-orange-700 disabled:bg-gray-300 transition-all flex items-center justify-center gap-4 shadow-xl shadow-orange-100"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={24} /> جاري الحفظ والرفع...</>
                        ) : (
                            <><Send size={24} /> اعتماد ونشر الحملة</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}