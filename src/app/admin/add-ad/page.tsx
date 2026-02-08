"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    ImagePlus, Link as LinkIcon, Type, Send, X,
    CheckCircle2, LayoutList, Loader2, Megaphone,
    Calendar, AlertCircle
} from "lucide-react";

export default function AddAdPage() {
    const [title, setTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [priority, setPriority] = useState("0");
    const [expiryDate, setExpiryDate] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                .from('sidebar_ads')
                .insert([{
                    title: title.trim(),
                    link_url: linkUrl.trim() || "#",
                    image_url: publicUrl,
                    priority: parseInt(priority) || 0,
                    expires_at: expiryDate || null,
                    is_active: true
                }]);

            if (insertError) throw insertError;

            showToast("تم تفعيل ونشر الإعلان بنجاح!", "success");
            setTitle(""); setLinkUrl(""); setPriority("0"); setExpiryDate(""); removeImage();
        } catch (err: any) {
            showToast(err.message || "حدث خطأ غير متوقع", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-2 pb-10" dir="rtl">

            {/* Toast Alert - Responsive width */}
            {toast.show && (
                <div className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto px-6 py-3 md:px-8 md:py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 z-[100] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? "bg-green-600 border-green-400 text-white" : "bg-red-600 border-red-400 text-white"
                    }`}>
                    <div className="flex items-center gap-3">
                        {toast.type === 'success' ? <CheckCircle2 className="shrink-0" size={24} /> : <AlertCircle className="shrink-0" size={24} />}
                        <span className="font-black text-sm md:text-lg">{toast.message}</span>
                    </div>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="hover:opacity-70">
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 md:p-8 border-b border-gray-100 bg-orange-50/50">
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 flex items-center gap-3 md:gap-4">
                        <div className="p-2 md:p-3 bg-orange-600 rounded-xl md:rounded-2xl text-white shadow-lg shadow-orange-200">
                            <Megaphone size={24} className="md:w-8 md:h-8" />
                        </div>
                        إضافة إعلان جديد
                    </h2>
                    <p className="text-xs md:text-base text-gray-500 font-bold mt-2 md:mt-4">نشر إعلان جديد في الشريط الجانبي</p>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6 md:space-y-8">
                    {/* عنوان الإعلان */}
                    <div className="space-y-2 md:space-y-3">
                        <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
                            <Type size={18} className="text-orange-600 md:w-5 md:h-5" /> عنوان الإعلان
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl outline-none text-gray-900 font-bold text-sm md:text-lg focus:border-orange-600 focus:bg-white transition-all"
                            placeholder="عروض الصيف..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {/* الرابط */}
                        <div className="space-y-2">
                            <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
                                <LinkIcon size={18} className="text-orange-600" /> رابط التوجيه
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl outline-none text-gray-900 font-bold text-left dir-ltr focus:border-orange-600 transition-all text-sm md:text-base"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </div>

                        {/* التاريخ */}
                        <div className="space-y-2">
                            <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
                                <Calendar size={18} className="text-red-600" /> تاريخ الانتهاء
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl outline-none text-gray-900 font-black focus:border-red-600 transition-all text-sm md:text-base"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* الأولوية */}
                    <div className="space-y-2">
                        <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
                            <LayoutList size={18} className="text-orange-600" /> ترتيب الظهور
                        </label>
                        <input
                            type="number"
                            className="w-24 md:w-40 p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl outline-none text-gray-900 font-black text-lg focus:border-orange-600 transition-all"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </div>

                    {/* الصورة */}
                    <div className="space-y-2">
                        <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
                            <ImagePlus size={18} className="text-orange-600" /> تصميم الإعلان
                        </label>
                        {!previewUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-200 p-8 md:p-16 rounded-[24px] md:rounded-[32px] text-center bg-gray-50 cursor-pointer hover:border-orange-600 hover:bg-orange-50/50 transition-all group"
                            >
                                <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <ImagePlus className="text-gray-400 group-hover:text-orange-600" size={24} />
                                </div>
                                <p className="text-base md:text-xl font-black text-gray-700">رفع صورة</p>
                                <p className="text-gray-400 font-bold mt-1 text-[10px] md:text-sm">يفضل مقاس طولي (Portrait)</p>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                                <img src={previewUrl} alt="Preview" className="w-full max-h-[300px] md:max-h-[400px] object-contain mx-auto" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-4 right-4 bg-red-600 text-white p-2 md:p-3 rounded-xl shadow-lg hover:bg-red-700 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>

                    {/* زر الإرسال */}
                    <button
                        disabled={loading}
                        className="w-full py-4 md:py-6 bg-orange-600 text-white font-black text-lg md:text-2xl rounded-xl md:rounded-2xl hover:bg-orange-700 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3 md:gap-4 shadow-xl shadow-orange-100"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={24} /> جاري النشر...</>
                        ) : (
                            <><Send size={24} /> نشر الإعلان</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}