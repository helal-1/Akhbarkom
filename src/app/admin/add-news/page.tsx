"use client";
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Upload, Send, Type, Tag, User,
  Image as ImageIcon, X, Loader2,
  CheckCircle2, AlertCircle
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

  // حالة التنبيه المخصص (Toast)
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: "",
    type: 'success'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // دالة إظهار التنبيه
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

      showToast("تم نشر الخبر بنجاح واكتملت العملية!", "success");

      // تصغير وإعادة تعيين الحقول
      setTitle(""); setContent(""); setAuthorName(""); removeImage();
    } catch (error: any) {
      showToast(error.message || "حدث خطأ أثناء النشر", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10" dir="rtl">

      {/* التنبيه المخصص (Toast) */}
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
        {/* هيدر الصفحة */}
        <div className="p-8 border-b-2 border-gray-100 bg-gray-50/50">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
            <div className="p-3 bg-blue-700 rounded-2xl text-white shadow-lg shadow-blue-100">
              <Upload size={32} />
            </div>
            إضافة خبر جديد للموقع
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* العنوان */}
          <div className="space-y-3">
            <label className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Type size={22} className="text-blue-700" /> عنوان الخبر الرئيسي
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none transition-all text-xl font-black text-gray-900 placeholder:text-gray-400 shadow-sm"
              placeholder="اكتب عنواناً جذاباً وواضحاً..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* القسم */}
            <div className="space-y-3">
              <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                <Tag size={22} className="text-blue-700" /> اختر القسم
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-black text-gray-900 cursor-pointer appearance-none"
              >
                <option value="سياسة">سياسة</option>
                <option value="رياضة">رياضة</option>
                <option value="اقتصاد">اقتصاد</option>
                <option value="صحة">صحة</option>
                <option value="عاجل">عاجل</option>
                <option value="حوادث">حوادث</option>
                <option value="شخصيات">شخصيات</option>
              </select>
            </div>

            {/* الكاتب */}
            <div className="space-y-3">
              <label className="text-lg font-black text-gray-800 flex items-center gap-2">
                <User size={22} className="text-blue-700" /> كاتب الخبر
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-blue-600 focus:bg-white outline-none text-gray-900 font-black"
                placeholder="اسم المحرر..."
              />
            </div>
          </div>

          {/* الصورة */}
          <div className="space-y-3">
            <label className="text-lg font-black text-gray-800 flex items-center gap-2">
              <ImageIcon size={22} className="text-blue-700" /> صورة الخبر
            </label>

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-gray-200 rounded-[32px] p-16 text-center hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer group bg-gray-50/50"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="text-gray-400 group-hover:text-blue-600" size={40} />
                </div>
                <p className="text-xl font-black text-gray-700">انقر هنا لاختيار صورة</p>
                <p className="text-sm text-gray-400 font-bold mt-2">يفضل استخدام صور عالية الدقة (1200x800)</p>
              </div>
            ) : (
              <div className="relative rounded-[24px] overflow-hidden h-96 border-2 border-gray-200 shadow-xl">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-6 right-6 bg-red-600 text-white p-3 rounded-2xl hover:bg-red-700 shadow-2xl transition-all active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>
            )}
          </div>

          {/* المحتوى */}
          <div className="space-y-3">
            <label className="text-lg font-black text-gray-800 flex items-center gap-2">تفاصيل الخبر</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-200 rounded-[24px] focus:border-blue-600 focus:bg-white outline-none h-96 text-xl font-bold text-gray-900 leading-relaxed resize-none shadow-sm"
              placeholder="ابدأ بكتابة تفاصيل الخبر هنا..."
              required
            />
          </div>

          {/* زر النشر */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white font-black text-2xl py-6 rounded-[20px] hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-4 disabled:bg-gray-300 active:scale-[0.99]"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={32} /> جاري النشر...</>
            ) : (
              <><Send size={28} /> اعتماد ونشر الخبر</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}