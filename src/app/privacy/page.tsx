"use client"; // نحتاج هذا لأن الـ Accordion يتطلب تفاعل (State)

import { useState } from "react";
import { ChevronDown, ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // لفتح أول سؤال تلقائياً

    const faqs = [
        {
            question: "ما هي المعلومات التي نجمعها عنك؟",
            answer: "نجمع معلومات تقنية بسيطة مثل عنوان الـ IP ونوع المتصفح عند زيارتك للموقع. إذا قمت بالتسجيل في القائمة البريدية، فنحن نحتفظ ببريدك الإلكتروني فقط لنرسل لك أهم الأخبار.",
            icon: Eye,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            question: "كيف نستخدم ملفات تعريف الارتباط (Cookies)؟",
            answer: "نستخدم الكوكيز لتحسين تجربتك، مثل تذكر تفضيلاتك الإخبارية وسرعة تحميل الصفحات. يمكنك دائماً تعطيلها من إعدادات متصفحك.",
            icon: FileText,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            question: "هل نقوم بمشاركة بياناتك مع أطراف خارجية؟",
            answer: "مطلقاً. نحن في 'أخباركم' نعتبر خصوصيتك خط أحمر. لا نقوم ببيع أو مشاركة أي بيانات تخص المستخدمين مع أي شركات إعلانية أو جهات خارجية.",
            icon: ShieldCheck,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            question: "كيف نحمي معلوماتك الشخصية؟",
            answer: "نستخدم بروتوكولات حماية متطورة (SSL) لتشفير جميع البيانات الصادرة والواردة من الموقع، مما يضمن بيئة تصفح آمنة تماماً.",
            icon: Lock,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <main className="min-h-screen bg-[#FDFDFD] pb-24" dir="rtl">
            {/* Header بسيط وفخم */}
            <div className="bg-white border-b-2 border-gray-100 mb-16 px-6 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-200">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">خصوصيتك أمانة</h1>
                    <p className="text-gray-500 font-bold">ببساطة وبدون تعقيد، إليك كيف نحمي بياناتك في "أخباركم".</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6">
                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div
                            key={index}
                            className={`border-2 rounded-[32px] transition-all duration-300 ${openIndex === index ? 'border-blue-600 bg-white shadow-xl shadow-blue-50' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full p-6 md:p-8 flex items-center justify-between outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}>
                                        <item.icon size={24} />
                                    </div>
                                    <span className={`text-lg font-black text-right ${openIndex === index ? 'text-blue-600' : 'text-gray-800'}`}>
                                        {item.question}
                                    </span>
                                </div>
                                <ChevronDown
                                    className={`text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-blue-600' : ''}`}
                                    size={24}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-8 pt-0 mr-16 text-gray-600 font-bold leading-relaxed border-t border-gray-50 mt-2">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* تنبيه أخير */}
                <div className="mt-16 p-8 bg-blue-600 rounded-[40px] text-white flex items-center gap-6">
                    <div className="hidden md:flex w-20 h-20 bg-white/20 rounded-full items-center justify-center shrink-0">
                        <ShieldCheck size={40} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black mb-1">هل لديك استفسار آخر؟</h3>
                        <p className="text-blue-100 font-bold text-sm">إذا كان لديك أي سؤال حول خصوصيتك، لا تتردد في مراسلتنا فوراً.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}