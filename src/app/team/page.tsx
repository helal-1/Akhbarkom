import Image from "next/image";
import { Twitter, Mail, Linkedin, ExternalLink } from "lucide-react";

const team = [
    {
        name: "أحمد رأفت",
        role: "رئيس التحرير",
        bio: "خبرة 15 عاماً في الصحافة السياسية، عمل في كبرى المؤسسات الإخبارية الدولية.",
        image: "/team/member1.jpg", // استبدلها بصور حقيقية لاحقاً
        social: { twitter: "#", mail: "#", linkedin: "#" }
    },
    {
        name: "سارة الجوهري",
        role: "مديرة المحتوى الرقمي",
        bio: "متخصصة في صناعة القصة الصحفية وتطوير استراتيجيات النشر الحديثة.",
        image: "/team/member2.jpg",
        social: { twitter: "#", mail: "#", linkedin: "#" }
    },
    {
        name: "محمود الشامي",
        role: "كبير المحررين الرياضيين",
        bio: "محلل رياضي وصحفي ميداني يغطي أهم البطولات المحلية والدولية.",
        image: "/team/member3.jpg",
        social: { twitter: "#", mail: "#", linkedin: "#" }
    },
    {
        name: "ليلى حسن",
        role: "محررة الشؤون الاقتصادية",
        bio: "باحثة اقتصادية متخصصة في تحليل أسواق المال والطاقة.",
        image: "/team/member4.jpg",
        social: { twitter: "#", mail: "#", linkedin: "#" }
    }
];

export default function TeamPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] pb-24" dir="rtl">
            {/* Header مع شكل هندسي */}
            <div className="bg-gray-900 py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full opacity-10">
                    <div className="absolute rotate-45 bg-blue-500 w-96 h-96 -top-48 -right-24 blur-[100px]"></div>
                </div>

                <div className="max-w-[1500px] mx-auto text-center relative z-10">
                    <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">
                        صناع الخبر
                    </span>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                        تعرف على <span className="text-blue-500">فريقنا</span>
                    </h1>
                    <p className="text-gray-400 font-bold text-lg max-w-2xl mx-auto leading-relaxed">
                        نخبة من أفضل الصحفيين والمبدعين يعملون على مدار الساعة لتقديم محتوى إخباري يليق بجمهور "أخباركم".
                    </p>
                </div>
            </div>

            {/* Team Grid */}
            <div className="max-w-[1500px] mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, i) => (
                        <div key={i} className="group bg-white rounded-[40px] p-8 border-2 border-gray-50 shadow-xl shadow-gray-200/50 hover:border-blue-600 transition-all duration-500 hover:-translate-y-3">

                            {/* صورة العضو */}
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 bg-blue-600 rounded-full rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white bg-gray-200">
                                    {/* أيقونة مؤقتة لحين وضع الصور */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">👤</div>
                                </div>
                            </div>

                            {/* البيانات */}
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {member.name}
                                </h3>
                                <p className="text-blue-600 font-black text-xs uppercase tracking-wider">
                                    {member.role}
                                </p>
                                <div className="h-px w-12 bg-gray-100 mx-auto my-4"></div>
                                <p className="text-gray-500 font-bold text-sm leading-relaxed px-2">
                                    {member.bio}
                                </p>
                            </div>

                            {/* روابط التواصل */}
                            <div className="flex items-center justify-center gap-3 mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                {[
                                    { Icon: Twitter, color: "hover:bg-sky-500" },
                                    { Icon: Linkedin, color: "hover:bg-blue-700" },
                                    { Icon: Mail, color: "hover:bg-red-500" },
                                ].map((item, index) => (
                                    <a key={index} href="#" className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-white ${item.color} transition-all`}>
                                        <item.Icon size={16} />
                                    </a>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>

                {/* زر الانضمام للفريق */}
                <div className="mt-20 bg-blue-600 rounded-[48px] p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-right">
                            <h2 className="text-3xl font-black text-white mb-2 text-center md:text-right">هل تريد الانضمام إلينا؟</h2>
                            <p className="text-blue-100 font-bold text-center md:text-right text-sm">نحن دائماً نبحث عن المبدعين والمحررين الشغوفين بالخبر.</p>
                        </div>
                        <button className="bg-white text-blue-600 px-10 py-4 rounded-[20px] font-black hover:bg-gray-100 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20">
                            أرسل سيرتك الذاتية <ExternalLink size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}