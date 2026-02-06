import { Target, ShieldCheck, Zap, Globe } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] pb-20" dir="rtl">
            {/* Hero Section - تصميم انسيابي */}
            <div className="bg-white border-b-2 border-gray-100 mb-16 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
                <div className="max-w-[1500px] mx-auto px-6 py-24 relative z-10">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black mb-6 inline-block uppercase tracking-wider">
                        قصتنا
                    </span>
                    <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1]">
                        نحن نصنع <span className="text-blue-600">مستقبل</span> <br /> الصحافة الرقمية.
                    </h1>
                    <p className="text-xl text-gray-500 font-bold max-w-2xl leading-relaxed">
                        في "أخباركم"، لا ننقل الخبر فحسب، بل نسعى لتقديم السياق الكامل والمصداقية التي يستحقها القارئ العربي في عصر المعلومات المتسارعة.
                    </p>
                </div>
            </div>

            <div className="max-w-[1500px] mx-auto px-6">
                {/* شبكة المميزات - تصميم الـ Cards الخاص بالموقع */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "سرعة فائقة",
                            desc: "نصل للخبر في لحظة حدوثه وننقله لك بدقة متناهية.",
                            icon: Zap,
                            color: "text-orange-500",
                            bg: "bg-orange-50"
                        },
                        {
                            title: "مصداقية تامة",
                            desc: "نعتمد على مصادرنا الخاصة ونتحقق من كل معلومة قبل النشر.",
                            icon: ShieldCheck,
                            color: "text-green-500",
                            bg: "bg-green-50"
                        },
                        {
                            title: "تغطية شاملة",
                            desc: "من السياسة للرياضة، نغطي كل ما يهم المواطن المصري والعربي.",
                            icon: Globe,
                            color: "text-blue-600",
                            bg: "bg-blue-50"
                        },
                        {
                            title: "رؤية طموحة",
                            desc: "نهدف لأن نكون المنصة الإخبارية الأولى تقنياً وصحفياً.",
                            icon: Target,
                            color: "text-purple-500",
                            bg: "bg-purple-50"
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border-2 border-gray-100 hover:border-blue-600/20 transition-all group">
                            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                            <p className="text-gray-500 font-bold text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* قسم إحصائيات سريع */}
                <div className="mt-20 bg-gray-900 rounded-[48px] p-12 text-center">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "مقال يومي", val: "+500" },
                            { label: "متابع نشط", val: "+1M" },
                            { label: "محرر صحفي", val: "+50" },
                            { label: "سنة خبرة", val: "10" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl font-black text-blue-500 mb-2">{stat.val}</div>
                                <div className="text-gray-400 font-bold text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}