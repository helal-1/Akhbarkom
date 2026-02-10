"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Zap, Calendar, ArrowLeft } from "lucide-react";

interface Article {
    id: string;
    title: string;
    slug: string;
    image_url?: string;
    created_at?: string;
}

interface HomeHeroSliderProps {
    articlesByCategory: Record<string, Article[]>;
}

export default function HomeHeroSlider({ articlesByCategory }: HomeHeroSliderProps) {
    // التعديل الجوهري هنا:
    // 1. flat() لدمج كل الأقسام
    // 2. sort() لترتيب الأخبار من الأحدث للأقدم حسب التاريخ
    // 3. slice(0, 5) لأخذ أحدث 5 أخبار فقط
    const featuredArticles = Object.values(articlesByCategory)
        .flat()
        .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 9);

    if (featuredArticles.length === 0) return null;

    return (
        <section className="relative w-full h-[500px] md:h-[600px] rounded-[32px] overflow-hidden group shadow-2xl shadow-blue-900/10 border border-gray-100">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{ clickable: true, dynamicBullets: true }}
                loop
                className="h-full w-full"
            >
                {featuredArticles.map((article) => (
                    <SwiperSlide key={article.id} className="h-full w-full bg-slate-900">
                        <div className="relative h-full w-full">
                            {/* الصورة */}
                            <Image
                                src={article.image_url || "/placeholder.jpg"}
                                alt={article.title}
                                fill
                                className="object-fill transition-transform duration-[10s] opacity-80"
                                priority
                                unoptimized
                            />

                            {/* التدرج اللوني */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent"></div>

                            {/* المحتوى النصي */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white text-right">
                                <div className="max-w-3xl space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                                    {/* Badge */}
                                    <div className="flex items-center gap-3">
                                        <span className="bg-red-600 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter flex items-center gap-2 shadow-lg shadow-red-600/40">
                                            <Zap size={14} fill="white" />
                                            حصري الآن
                                        </span>
                                        <span className="text-white/60 text-xs font-bold flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {article.created_at ? new Date(article.created_at).toLocaleDateString('ar-EG') : 'اليوم'}
                                        </span>
                                    </div>

                                    {/* العنوان */}
                                    <h2 className="text-3xl md:text-5xl font-black leading-[1.2] drop-shadow-2xl">
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">
                                            {article.title}
                                        </span>
                                    </h2>

                                    {/* زر التفاصيل */}
                                    <div className="pt-4">
                                        <Link
                                            href={`/news/${article.slug}`}
                                            className="inline-flex items-center gap-4 bg-blue-600 hover:bg-white text-white hover:text-blue-600 px-8 py-4 rounded-[20px] font-black text-sm transition-all duration-500 transform hover:-translate-y-1 group/btn overflow-hidden relative shadow-xl shadow-blue-600/20"
                                        >
                                            <span className="relative z-10">اقرأ القصة الكاملة</span>
                                            <ArrowLeft size={20} className="relative z-10 group-hover/btn:translate-x-[-5px] transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ستايل نقاط الترقيم */}
            <style jsx global>{`
                .swiper-pagination-bullets.swiper-pagination-horizontal {
                    bottom: 30px !important;
                    right: 30px !important;
                    width: auto !important;
                    left: auto !important;
                }
                .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(255,255,255,0.3);
                    opacity: 1;
                    margin: 0 5px !important;
                    transition: all 0.3s ease;
                }
                .swiper-pagination-bullet-active {
                    background: #2563eb !important;
                    width: 35px !important;
                    border-radius: 10px;
                }
            `}</style>
        </section>
    );
}