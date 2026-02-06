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

    // حالات التنبيه المخصصة
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: "",
        type: 'success'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // دالة لإظهار التنبيه وإخفائه تلقائياً
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

            // إعادة تعيين الحقول
            setTitle("");
            setLinkUrl("");
            setPriority("0");
            setExpiryDate("");
            removeImage();

        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-10" dir="rtl">

            {/* التنبيه المخصص (Toast Alert) */}
            {toast.show && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success'
                        ? "bg-green-600 border-green-400 text-white"
                        : "bg-red-600 border-red-400 text-white"
                    }`}>
                    {toast.type === 'success' ? <CheckCircle2 size={28} /> : <AlertCircle size={28} />}
                    <span className="font-black text-lg">{toast.message}</span>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="mr-4 hover:opacity-70">
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="bg-white rounded-[32px] shadow-sm border-2 border-gray-200 overflow-hidden">
                <div className="p-8 border-b-2 border-gray-100 bg-orange-50/50">
                    <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                        <div className="p-3 bg-orange-600 rounded-2xl text-white shadow-lg shadow-orange-200">
                            <Megaphone size={32} />
                        </div>
                        إضافة إعلان جديد
                    </h2>
                    <p className="text-gray-500 font-bold mt-4 mr-1">قم بملء البيانات أدناه لنشر الإعلان في السايدبار</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* عنوان الإعلان */}
                    <div className="space-y-3">
                        <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <Type size={22} className="text-orange-600" /> عنوان الإعلان (داخلي)
                        </label>
                        <input
                            type="text"
                            className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 font-bold text-lg focus:border-orange-600 focus:bg-white transition-all"
                            placeholder="مثال: عروض شهر رمضان"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* الرابط */}
                        <div className="space-y-3">
                            <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                                <LinkIcon size={22} className="text-orange-600" /> رابط التوجيه
                            </label>
                            <input
                                type="url"
                                placeholder="https://..."
                                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 font-bold text-left dir-ltr focus:border-orange-600 focus:bg-white transition-all"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                            />
                        </div>

                        {/* التاريخ */}
                        <div className="space-y-3">
                            <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                                <Calendar size={22} className="text-red-600" /> تاريخ الانتهاء
                            </label>
                            <input
                                type="date"
                                className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 font-black focus:border-red-600 focus:bg-white transition-all"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* الأولوية */}
                    <div className="space-y-3">
                        <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <LayoutList size={22} className="text-orange-600" /> ترتيب الظهور
                        </label>
                        <input
                            type="number"
                            className="w-40 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none text-gray-900 font-black text-xl focus:border-orange-600 focus:bg-white transition-all"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        />
                    </div>

                    {/* الصورة */}
                    <div className="space-y-3">
                        <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                            <ImagePlus size={22} className="text-orange-600" /> تصميم الإعلان
                        </label>
                        {!previewUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-4 border-dashed border-gray-200 p-16 rounded-[32px] text-center bg-gray-50 cursor-pointer hover:border-orange-600 hover:bg-orange-50/50 transition-all group"
                            >
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <ImagePlus className="text-gray-400 group-hover:text-orange-600" size={40} />
                                </div>
                                <p className="text-xl font-black text-gray-700">اضغط لرفع الصورة</p>
                                <p className="text-gray-400 font-bold mt-2 text-sm">يفضل مقاس طولي للسايدبار</p>
                            </div>
                        ) : (
                            <div className="relative rounded-[24px] overflow-hidden border-2 border-gray-200 shadow-xl bg-gray-100">
                                <img src={previewUrl} alt="Preview" className="w-full max-h-[400px] object-contain mx-auto" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-6 right-6 bg-red-600 text-white p-3 rounded-2xl shadow-lg hover:bg-red-700 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>

                    {/* زر الإرسال */}
                    <button
                        disabled={loading}
                        className="w-full py-6 bg-orange-600 text-white font-black text-2xl rounded-2xl hover:bg-orange-700 disabled:bg-gray-300 transition-all flex items-center justify-center gap-4 shadow-xl shadow-orange-100 active:scale-[0.99]"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={32} /> جاري المعالجة...</>
                        ) : (
                            <><Send size={28} /> نشر الإعلان الآن</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}