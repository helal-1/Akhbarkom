"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

// Swiper Styles
import "swiper/css";

interface Article {
    id: string;
    title: string;
    slug: string;
    category: string;
}

export default function UrgentTicker({ articles }: { articles: Article[] }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div className="bg-white border-b border-gray-100 shadow-sm relative z-50 overflow-hidden">
            <div className="max-w-[1500px] mx-auto flex items-center h-10 md:h-12">

                {/* ملصق "عاجل" - صغرنا الحجم والخط */}
                <div className="bg-red-600 text-white flex items-center gap-1.5 px-3 md:px-5 h-full shrink-0 relative z-10">
                    <Zap size={14} fill="currentColor" className="animate-pulse" />
                    <span className="text-[11px] md:text-sm font-black whitespace-nowrap">عاجل</span>
                    {/* سهم ديكور صغير */}
                    <div className="absolute -left-2 top-0 bottom-0 w-2 bg-red-600 [clip-path:polygon(0_0,0_100%,100%_50%)]"></div>
                </div>

                {/* السلايدر - جعلنا الارتفاع أقل والخط أنعم */}
                <div className="flex-1 h-full px-4 overflow-hidden">
                    <Swiper
                        direction={"vertical"}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        modules={[Autoplay]}
                        className="h-full"
                    >
                        {articles.map((article) => (
                            <SwiperSlide key={article.id} className="flex items-center">
                                <Link
                                    href={`/news/${article.slug}`}
                                    className="flex items-center gap-2 group w-full"
                                >
                                    {/* اسم القسم بلون خفيف */}
                                    <span className="hidden sm:inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                                        {article.category}
                                    </span>
                                    {/* العنوان - line-clamp-1 لضمان عدم الخروج عن السطر */}
                                    <h3 className="text-[11px] md:text-[13px] font-bold text-gray-700 group-hover:text-red-600 transition-colors line-clamp-1 leading-tight">
                                        {article.title}
                                    </h3>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* التاريخ - يظهر في الشاشات الكبيرة فقط وبشكل مصغر */}
                <div className="hidden lg:flex items-center gap-2 px-6 border-r border-gray-50 text-[11px] font-bold text-gray-400 shrink-0">
                    {new Date().toLocaleDateString("ar-EG", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                    })}
                </div>
            </div>
        </div>
    );
}