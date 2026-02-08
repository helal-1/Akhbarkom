"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, MapPin, Send, MessageSquare, Share2, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        subject: "استفسار عام",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from("contact_messages")
            .insert([formData]);

        if (!error) {
            setSubmitted(true);
            setFormData({ full_name: "", email: "", subject: "استفسار عام", message: "" });
        } else {
            alert("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-10 md:pb-20" dir="rtl">
            {/* Header Section */}
            <div className="bg-white border-b-2 border-gray-100 mb-8 md:mb-16 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-blue-50 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-60"></div>
                <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-12 md:py-24 relative z-10">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black mb-4 md:mb-6 inline-block tracking-wider">
                        الدعم الفني والتحرير
                    </span>
                    <h1 className="text-3xl md:text-6xl font-black text-gray-900 mb-4 md:mb-6 tracking-tight">
                        نحن هنا <span className="text-blue-600">لنسمع</span> منك.
                    </h1>
                </div>
            </div>

            <div className="max-w-[1500px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

                {/* معلومات التواصل */}
                <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "راسلنا على", val: "info@akhbarkom.com", icon: Mail, bg: "bg-blue-50", text: "text-blue-600" },
                            { label: "اتصل بنا", val: "+20 123 456 7890", icon: Phone, bg: "bg-green-50", text: "text-green-600" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-5 rounded-[24px] border-2 border-white shadow-sm transition-all group">
                                <div className={`w-10 h-10 ${item.bg} ${item.text} rounded-xl flex items-center justify-center mb-4`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <p className="text-[9px] text-gray-400 font-black uppercase mb-1">{item.label}</p>
                                <p className="text-gray-800 font-black text-xs break-words">{item.val}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-900 rounded-[32px] p-6 text-white relative overflow-hidden group">
                        <MessageSquare className="absolute -left-4 -bottom-4 text-white/5 w-24 h-24" />
                        <h3 className="text-lg font-black mb-2 relative z-10">هل لديك سبق صحفي؟</h3>
                        <p className="text-gray-400 font-bold text-xs relative z-10 leading-relaxed">أرسل الصور والفيديوهات مباشرة عبر واتساب.</p>
                        <button className="mt-5 bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs relative z-10 shadow-lg shadow-blue-900/20">ارسل عبر واتساب</button>
                    </div>
                </div>

                {/* نموذج المراسلة الفعلي */}
                <div className="lg:col-span-7 order-1 lg:order-2">
                    <div className="bg-white p-2 rounded-[32px] md:rounded-[48px] border-2 border-gray-100 shadow-xl shadow-gray-200/40">
                        {submitted ? (
                            <div className="p-12 md:p-20 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">تم إرسال رسالتك بنجاح!</h2>
                                <p className="text-gray-500 font-bold">شكراً لتواصلك معنا، سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.</p>
                                <button onClick={() => setSubmitted(false)} className="text-blue-600 font-black text-sm underline underline-offset-4">إرسال رسالة أخرى</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-800 mr-1">الاسم الكامل</label>
                                        <input
                                            required
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            type="text"
                                            className="w-full bg-white border-2 border-gray-200 p-3 md:p-4 rounded-xl font-bold text-sm text-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-800 mr-1">البريد الإلكتروني</label>
                                        <input
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            type="email"
                                            className="w-full bg-white border-2 border-gray-200 p-3 md:p-4 rounded-xl font-bold text-sm text-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-800 mr-1">الموضوع</label>
                                    <div className="relative">
                                        <select
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-white border-2 border-gray-200 p-3 md:p-4 rounded-xl font-bold text-sm text-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                                        >
                                            <option>استفسار عام</option>
                                            <option>طلب إعلانات</option>
                                            <option>إرسال خبر/سبق</option>
                                            <option>مشكلة تقنية</option>
                                        </select>
                                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-5 h-5" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-800 mr-1">رسالتك</label>
                                    <textarea
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={5}
                                        className="w-full bg-white border-2 border-gray-200 p-3 md:p-4 rounded-xl font-bold text-sm text-gray-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-4 md:py-5 rounded-xl font-black text-base flex items-center justify-center gap-3 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>إرسال الآن <Send className="w-5 h-5" /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}