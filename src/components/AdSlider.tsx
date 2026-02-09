"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import { Sparkles, ExternalLink, Loader2 } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface Ad {
    id: string;
    image_url: string;
    link_url: string;
    title: string;
    placements: string[];
}

interface AdSliderProps {
    placement?: "sidebar" | "between_sections" | "home_top" | "article_page";
}

export default function AdSlider({ placement = "sidebar" }: AdSliderProps) {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAds = useCallback(async () => {
        try {
            setLoading(true);
            // ملاحظة: تم تغيير اسم الجدول هنا إلى "ads" ليتوافق مع ما قمت بإنشائه
            const { data, error } = await supabase
                .from("ads")
                .select("*")
                .eq("is_active", true)
                .contains('placements', [placement])
                .order("priority", { ascending: false });

            if (error) {
                // محاولة احتياطية في حال كان الجدول لا يزال يسمى sidebar_ads في قاعدة بياناتك
                if (error.message.includes("not exist")) {
                    const { data: fallbackData } = await supabase
                        .from("sidebar_ads")
                        .select("*")
                        .eq("is_active", true)
                        .contains('placements', [placement]);
                    if (fallbackData) setAds(fallbackData);
                } else {
                    throw error;
                }
            } else if (data) {
                setAds(data);
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "خطأ غير معروف";
            console.error("AdSlider Fetch Error:", msg);
        } finally {
            setLoading(false);
        }
    }, [placement]);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    if (loading) {
        return (
            <div className="bg-white/50 backdrop-blur-md h-[300px] md:h-[450px] rounded-[32px] border border-gray-100 flex flex-col items-center justify-center gap-3 shadow-sm">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">جاري تجهيز العروض...</span>
            </div>
        );
    }

    if (ads.length === 0) return null;

    return (
        <div className="relative group w-full">
            <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">

                <div className="p-3 md:p-4 bg-gray-50/50 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-widest uppercase">
                            {placement === "sidebar" ? "دليل الخدمات" : "إعلان ممول"}
                        </span>
                    </div>
                    <Sparkles size={14} className="text-orange-300" />
                </div>

                <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    loop={ads.length > 1}
                    className={`${placement === "sidebar" ? "h-[400px] md:h-[500px]" : "h-[200px] md:h-[350px]"} w-full`}
                >
                    {ads.map((ad) => (
                        <SwiperSlide key={ad.id}>
                            <a
                                href={ad.link_url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative block w-full h-full group/ad"
                            >
                                <Image
                                    src={ad.image_url}
                                    alt={ad.title || "إعلان"}
                                    fill
                                    className="object-cover transition-transform duration-[2000ms] group-hover/ad:scale-110"
                                    unoptimized
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-5 md:p-8">
                                    <div className="translate-y-2 group-hover/ad:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white font-black text-sm md:text-lg mb-2 md:mb-3 leading-tight">
                                            {ad.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-4 py-2 md:px-5 md:py-2.5 rounded-xl shadow-xl flex items-center gap-2">
                                                زيارة <ExternalLink size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}