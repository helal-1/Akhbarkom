import { Star, MessageCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function SidebarWidgets({ categoryName }: { categoryName: string }) {
    // بيانات تجريبية لاختيارات المحرر (يمكنك جلبها لاحقاً من Supabase بفلتر خاص)
    const editorsPicks = [
        {
            id: 1,
            title: "تحليل عميق: كيف سيؤثر القرار الجديد على خارطة المنطقة؟",
            image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=200&h=150&auto=format&fit=crop",
        },
        {
            id: 2,
            title: "حوار خاص مع وزير الخارجية حول مستجدات القمة الأخيرة",
            image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=200&h=150&auto=format&fit=crop",
        },
    ];

    return (
        <div className="flex flex-col gap-6 mt-6">

            {/* 1. ويدجت اختيارات المحرر */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Star className="text-orange-500 fill-orange-500" size={20} />
                        مختارات المحرر
                    </h3>
                </div>
                <div className="p-4 space-y-4">
                    {editorsPicks.map((news) => (
                        <div key={news.id} className="group cursor-pointer">
                            <div className="flex gap-3">
                                <div className="relative w-20 h-16 rounded-2xl overflow-hidden shrink-0">
                                    <Image src={news.image} alt={news.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <h4 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                                    {news.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. ويدجت الاشتراك في الواتساب */}
            <div className="relative bg-[#075E54] rounded-[32px] p-6 overflow-hidden group">
                {/* تأثير خلفية خفيفة */}
                <div className="absolute -right-4 -bottom-4 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <MessageCircle size={120} />
                </div>

                <div className="relative z-10">
                    <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                        <MessageCircle className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">
                        تابع مستجدات {categoryName}
                    </h3>
                    <p className="text-white/80 text-sm font-bold mb-5 leading-relaxed">
                        اشترك في قناتنا على واتساب لتصلك أهم الأخبار العاجلة أولاً بأول.
                    </p>
                    <button className="w-full bg-white text-[#075E54] py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95">
                        اشترك الآن مجاناً
                        <ArrowLeft size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
}