"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import { Sparkles, ExternalLink, Loader2 } from "lucide-react";

// استيراد ستايلات Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface Ad {
    id: string;
    image_url: string;
    link_url: string;
    title: string;
}

export default function AdSlider() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const { data, error } = await supabase
                    .from("sidebar_ads")
                    .select("*")
                    .eq("is_active", true)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                if (data) setAds(data);
            } catch (err) {
                console.error("AdSlider Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    if (loading) {
        return (
            <div className="bg-white/50 backdrop-blur-md h-[450px] rounded-[32px] border border-gray-100 flex flex-col items-center justify-center gap-3 shadow-sm">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">جاري تجهيز العروض...</span>
            </div>
        );
    }

    if (ads.length === 0) return null;

    return (
        <div className="relative group">
            {/* الحاوية الخارجية بتصميم الـ Card الحديث */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">

                {/* الرأس (Header) بتصميم عصري */}
                <div className="p-4 bg-gray-50/50 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">إعلانات ممولة</span>
                    </div>
                    <Sparkles size={14} className="text-orange-300" />
                </div>

                <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade" // تأثير انتقال ناعم جداً
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    loop={ads.length > 1}
                    className="h-[450px] md:h-[500px] w-full"
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

                                {/* طبقة الظل المتدرجة والنصوص */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                    <div className="translate-y-4 group-hover/ad:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-white font-black text-lg mb-3 leading-tight">
                                            {ad.title}
                                        </h3>

                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-600 text-white text-[10px] font-black px-5 py-2.5 rounded-xl shadow-xl flex items-center gap-2 hover:bg-blue-700 transition-colors">
                                                زيارة الرابط <ExternalLink size={12} />
                                            </span>

                                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 opacity-0 group-hover/ad:opacity-100 transition-opacity">
                                                <Sparkles size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* تأثير خلفي (Glow) بسيط يعطي فخامة للسايدبار */}
            <div className="absolute -inset-2 bg-blue-500/5 blur-2xl rounded-[40px] -z-10 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
        </div>
    );
}