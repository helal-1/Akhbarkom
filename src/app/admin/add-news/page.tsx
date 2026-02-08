"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Upload, Send, Type, Tag, User,
  Image as ImageIcon, X, Loader2,
  CheckCircle2, AlertCircle, FileText
} from "lucide-react";
import Image from "next/image";

export default function AddNewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("سياسة");
  const [authorName, setAuthorName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // حالة التنبيه المخصص
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
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !image) {
      return showToast("يرجى ملء جميع الحقول الأساسية مع الصورة", "error");
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("news_images").upload(fileName, image);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("news_images").getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const slug = title.trim().replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g, "").replace(/\s+/g, "-").toLowerCase();

      const { error } = await supabase.from("articles").insert([
        { title, content, category, author_name: authorName || "المسؤول", image_url: imageUrl, slug },
      ]);

      if (error) throw error;

      showToast("تم نشر الخبر بنجاح!", "success");
      setTitle(""); setContent(""); setAuthorName(""); removeImage();
    } catch (error: unknown) {
      // تصحيح خطأ any في TypeScript
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء النشر";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 pb-10" dir="rtl">

      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 w-[92%] md:w-auto px-6 py-3 md:px-8 md:py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 z-[100] border-2 animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'success' ? "bg-green-600 border-green-400 text-white" : "bg-red-600 border-red-400 text-white"
          }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? <CheckCircle2 className="shrink-0" size={24} /> : <AlertCircle className="shrink-0" size={24} />}
            <span className="font-black text-sm md:text-lg">{toast.message}</span>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="hover:opacity-70 transition-opacity">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl md:text-3xl font-black text-gray-900 flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-blue-700 rounded-xl md:rounded-2xl text-white shadow-lg shadow-blue-100">
              <Upload className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            إضافة خبر جديد
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6 md:space-y-8">

          {/* العنوان */}
          <div className="space-y-2 md:space-y-3">
            <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
              <Type size={18} className="text-blue-700" /> عنوان الخبر
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 md:px-6 md:py-5 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-base md:text-xl font-bold text-gray-900"
              placeholder="اكتب العنوان هنا..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* القسم */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
                <Tag size={18} className="text-blue-700" /> القسم
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 md:px-6 md:py-5 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-bold text-gray-900 cursor-pointer appearance-none text-sm md:text-base"
              >
                {["سياسة", "رياضة", "اقتصاد", "صحة", "عاجل", "حوادث", "شخصيات"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* الكاتب */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
                <User size={18} className="text-blue-700" /> اسم المحرر
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-3 md:px-6 md:py-5 bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl focus:border-blue-600 focus:bg-white outline-none text-gray-900 font-bold text-sm md:text-base"
                placeholder="اتركه فارغاً للاسم الافتراضي"
              />
            </div>
          </div>

          {/* الصورة */}
          <div className="space-y-2 md:space-y-3">
            <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
              <ImageIcon size={18} className="text-blue-700" /> صورة الخبر
            </label>

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-[20px] md:rounded-[32px] p-8 md:p-16 text-center hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer group bg-gray-50/50"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  {/* تم حل مشكلة md:size هنا باستخدام className */}
                  <Upload className="text-gray-400 group-hover:text-blue-600 w-6 h-6 md:w-10 md:h-10" />
                </div>
                <p className="text-base md:text-xl font-black text-gray-700">اضغط لرفع الصورة</p>
                <p className="text-[10px] md:text-sm text-gray-400 font-bold mt-1">يفضل جودة HD (1200x800)</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden h-48 md:h-96 border border-gray-200 shadow-md">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 md:top-6 md:right-6 bg-red-600 text-white p-2 md:p-3 rounded-xl hover:bg-red-700 shadow-lg transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* المحتوى */}
          <div className="space-y-2 md:space-y-3">
            <label className="text-base md:text-lg font-black text-gray-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-700" /> تفاصيل الخبر
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-4 md:px-8 md:py-6 bg-gray-50 border border-gray-200 rounded-xl md:rounded-[24px] focus:border-blue-600 focus:bg-white outline-none h-64 md:h-96 text-base md:text-xl font-bold text-gray-900 leading-relaxed resize-none shadow-sm"
              placeholder="ابدأ بكتابة الخبر هنا..."
              required
            />
          </div>

          {/* زر النشر */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white font-black text-lg md:text-2xl py-4 md:py-6 rounded-xl md:rounded-[20px] hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 md:gap-4 disabled:bg-gray-300 active:scale-[0.99]"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={24} /> جاري النشر...</>
            ) : (
              <><Send size={24} /> اعتماد ونشر الخبر</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}