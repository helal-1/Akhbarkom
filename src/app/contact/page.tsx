import { Mail, Phone, MapPin, Send, MessageSquare, Share2 } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FDFDFD] pb-20" dir="rtl">
            {/* Header Section */}
            <div className="bg-white border-b-2 border-gray-100 mb-16 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-60"></div>
                <div className="max-w-[1500px] mx-auto px-6 py-24 relative z-10">
                    <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black mb-6 inline-block tracking-wider">
                        الدعم الفني والتحرير
                    </span>
                    <h1 className="text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        نحن هنا <span className="text-blue-600">لنسمع</span> منك.
                    </h1>
                    <p className="text-xl text-gray-500 font-bold max-w-2xl leading-relaxed">
                        سواء كان لديك سبق صحفي، استفسار إعلاني، أو واجهت مشكلة تقنية، فريقنا متاح للرد عليك على مدار الساعة.
                    </p>
                </div>
            </div>

            <div className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* معلومات التواصل - الجانب الأيمن */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "راسلنا على", val: "info@akhbarkom.com", icon: Mail, bg: "bg-blue-50", text: "text-blue-600" },
                            { label: "اتصل بنا", val: "+20 123 456 7890", icon: Phone, bg: "bg-green-50", text: "text-green-600" },
                            { label: "المكتب الرئيسي", val: "القاهرة، مدينة نصر", icon: MapPin, bg: "bg-orange-50", text: "text-orange-600" },
                            { label: "تابعنا", val: "@akhbarkom", icon: Share2, bg: "bg-purple-50", text: "text-purple-600" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-[32px] border-2 border-gray-50 shadow-sm hover:border-blue-100 transition-all">
                                <div className={`w-12 h-12 ${item.bg} ${item.text} rounded-2xl flex items-center justify-center mb-4`}>
                                    <item.icon size={22} />
                                </div>
                                <p className="text-[10px] text-gray-400 font-black uppercase mb-1">{item.label}</p>
                                <p className="text-gray-800 font-black text-sm">{item.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* نصيحة سريعة */}
                    <div className="bg-gray-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                        <MessageSquare className="absolute -left-4 -bottom-4 text-white/5 group-hover:rotate-12 transition-transform" size={120} />
                        <h3 className="text-xl font-black mb-3 relative z-10">هل لديك سبق صحفي؟</h3>
                        <p className="text-gray-400 font-bold text-sm leading-relaxed relative z-10">
                            يمكنك إرسال الصور والفيديوهات مباشرة عبر الواتساب الخاص بقسم التحقيقات. نضمن سرية المصدر دائماً.
                        </p>
                        <button className="mt-6 bg-white text-gray-900 px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-50 transition-colors relative z-10">
                            ارسل عبر واتساب
                        </button>
                    </div>
                </div>

                {/* نموذج المراسلة - الجانب الأيسر */}
                <div className="lg:col-span-7">
                    <div className="bg-white p-2 rounded-[48px] border-2 border-gray-100 shadow-xl shadow-blue-50/50">
                        <form className="p-10 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    {/* جعلنا العنوان أغمق وأكبر قليلاً */}
                                    <label className="text-sm font-black text-gray-700 mr-2">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        placeholder="مثال: أحمد محمد"
                                        className="w-full bg-gray-100 border-2 border-transparent p-4 rounded-[20px] font-bold text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-2">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        placeholder="name@email.com"
                                        className="w-full bg-gray-100 border-2 border-transparent p-4 rounded-[20px] font-bold text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-600 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 mr-2">الموضوع</label>
                                <select className="w-full bg-gray-100 border-2 border-transparent p-4 rounded-[20px] font-bold text-gray-900 focus:bg-white focus:border-blue-600 outline-none transition-all appearance-none cursor-pointer">
                                    <option>استفسار عام</option>
                                    <option>طلب إعلانات</option>
                                    <option>إرسال خبر/سبق</option>
                                    <option>مشكلة تقنية</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 mr-2">رسالتك</label>
                                <textarea
                                    rows={6}
                                    placeholder="كيف يمكننا مساعدتك اليوم؟"
                                    className="w-full bg-gray-100 border-2 border-transparent p-4 rounded-[24px] font-bold text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-600 outline-none transition-all resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full bg-blue-600 text-white p-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-[0.98]">
                                إرسال الآن
                                <Send size={22} />
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </main>
    );
}