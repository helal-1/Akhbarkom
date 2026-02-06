"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowLeft, Sparkles } from 'lucide-react';

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

export default function NewsCard({ article }: { article: Article }) {

    const formatDate = (dateString?: string) => {
        if (!dateString) return "منذ قليل";
        const date = new Date(dateString);
        return date.toLocaleDateString("ar-EG", {
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Link href={`/news/${article.slug}`} className="block group mb-6">
            <div className="relative bg-white/70 backdrop-blur-md border border-gray-250 rounded-[24px] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1 flex flex-col md:flex-row gap-6 items-center" dir="rtl">

                {/* 1. الصورة بتأثير زجاجي وحواف ناعمة */}
                <div className="relative w-full md:w-48 h-48 shrink-0 rounded-[20px] overflow-hidden shadow-indigo-100/50 shadow-xl">
                    <Image
                        src={article.image_url || "/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        unoptimized
                    />
                    {/* وسم القسم بتصميم عصري */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] px-3 py-1.5 rounded-full font-black shadow-sm flex items-center gap-1.5">
                        <Sparkles size={10} className="text-orange-400" />
                        {article.category || "أخبار"}
                    </div>
                </div>

                {/* 2. المحتوى والتفاصيل */}
                <div className="flex flex-col flex-1 w-full py-1">

                    {/* الهوية البصرية الصغيرة */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative w-5 h-5 rounded-lg overflow-hidden border border-gray-50 shadow-sm">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">أخباركم PORTAL</span>
                    </div>

                    {/* عنوان الخبر - خط عريض وأنيق */}
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-3 line-clamp-2 leading-[1.4] group-hover:text-blue-600 transition-colors duration-300">
                        {article.title}
                    </h2>

                    {/* الوصف المختصر */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed font-medium opacity-80">
                        {article.content}
                    </p>

                    {/* الفوتر الخاص بالكارت */}
                    <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                        <div className="flex items-center gap-4 text-[11px] font-bold">
                            <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-full text-blue-600 border border-blue-50/50">
                                <User size={12} strokeWidth={3} />
                                <span>{article.author_name || "المسؤول"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-gray-400">
                                <Clock size={12} />
                                <span>{formatDate(article.created_at)}</span>
                            </div>
                        </div>

                        {/* زر الانتقال التفاعلي */}
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-0 rotate-45 transition-all duration-500">
                            <ArrowLeft size={16} strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* تأثير الإضاءة عند الحوم (اختياري) */}
                <div className="absolute inset-0 rounded-[24px] border-2 border-transparent group-hover:border-blue-500/5 transition-all duration-500 pointer-events-none"></div>
            </div>
        </Link>
    );
}