"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowLeft, Sparkles, Newspaper } from 'lucide-react';

interface Article {
    id: string;
    title: string;
    content: string;
    image_url: string;
    slug: string;
    category?: string;
    created_at?: string;
    author_name?: string;
}

// خريطة الألوان للأقسام لتسهيل التمييز البصري
const categoryColors: Record<string, string> = {
    politics: "text-emerald-600 bg-emerald-50 border-emerald-100",
    sports: "text-orange-600 bg-orange-50 border-orange-100",
    tech: "text-blue-600 bg-blue-50 border-blue-100",
    economy: "text-purple-600 bg-purple-50 border-purple-100",
    health: "text-red-600 bg-red-50 border-red-100",
    urgent: "text-white bg-red-600 border-red-600",
};

const categoryLabels: Record<string, string> = {
    politics: "سياسة", sports: "رياضة", tech: "تكنولوجيا",
    economy: "اقتصاد", health: "صحة", urgent: "عاجل", Accidents: "حوادث"
};

export default function NewsCard({ article }: { article: Article }) {

    const formatDate = (dateString?: string) => {
        if (!dateString) return "منذ قليل";
        const date = new Date(dateString);
        return date.toLocaleDateString("ar-EG", {
            month: 'long',
            day: 'numeric',
        });
    };

    const catStyle = categoryColors[article.category || ""] || "text-gray-600 bg-gray-50 border-gray-100";
    const catLabel = categoryLabels[article.category || ""] || article.category || "أخبار";

    return (
        <Link href={`/news/${article.slug}`} className="block group">
            <div className="relative bg-white border-2 border-gray-100 rounded-[24px] p-4 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:border-blue-100 flex flex-col md:flex-row gap-5 items-center overflow-hidden" dir="rtl">

                {/* 1. الصورة مع تأثير الحوم */}
                <div className="relative w-full md:w-52 h-44 shrink-0 rounded-[20px] overflow-hidden">
                    <Image
                        src={article.image_url || "/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                    />
                    {/* Tag القسم التفاعلي */}
                    <div className={`absolute top-3 right-3 backdrop-blur-md border text-[10px] px-3 py-1.5 rounded-full font-black shadow-sm flex items-center gap-1.5 transition-transform group-hover:-translate-y-1 ${catStyle}`}>
                        <Sparkles size={10} className={article.category === 'urgent' ? 'text-white' : 'text-orange-400'} />
                        {catLabel}
                    </div>
                </div>

                {/* 2. المحتوى */}
                <div className="flex flex-col flex-1 w-full">

                    {/* الهوية البصرية */}
                    <div className="flex items-center gap-2 mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Newspaper size={12} className="text-blue-600" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">أخباركم PORTAL</span>
                    </div>

                    {/* عنوان الخبر */}
                    <h2 className="text-lg md:text-xl font-black text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                        {article.title}
                    </h2>

                    {/* المحتوى المختصر */}
                    <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 leading-relaxed font-medium">
                        {article.content}
                    </p>

                    {/* الفوتر */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold">
                                <User size={12} className="text-gray-300" />
                                <span>{article.author_name || "المسؤول"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-bold">
                                <Clock size={12} className="text-gray-300" />
                                <span>{formatDate(article.created_at)}</span>
                            </div>
                        </div>

                        {/* سهم الانتقال بشكله الجديد */}
                        <div className="flex items-center gap-2 text-blue-600 font-black text-[11px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                            اقرأ المزيد
                            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all">
                                <ArrowLeft size={14} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* خط تجميلي جانبي يظهر عند الحوم */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500"></div>
            </div>
        </Link>
    );
}