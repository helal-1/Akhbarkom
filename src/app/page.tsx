import { supabase } from "@/lib/supabase";
import NewsCard from "@/components/ui/NewsCard";
import AdSlider from "@/components/AdSlider";
import Link from "next/link";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import UrgentTicker from "@/components/UrgentTicker";
import { Zap, Clock, MessageCircle } from "lucide-react";

// ضمان تحديث البيانات فوراً عند إضافة خبر من الهاتف
export const revalidate = 0;

// تعريف نوع البيانات بدقة لإرضاء TypeScript و ESLint
interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  image_url: string;
  created_at?: string;
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

const categoriesMap: Record<string, { label: string; color: string; slug: string }> = {
  "عاجل": { label: "أخبار عاجلة", color: "bg-red-600", slug: "urgent" },
  "تعليم": { label: "التعليم", color: "bg-cyan-600", slug: "education" },
  "دليل طامية": { label: "دليل طامية", color: "bg-amber-600", slug: "tamiya" },
  "سياسة": { label: "سياسة", color: "bg-emerald-600", slug: "politics" },
  "رياضة": { label: "رياضة", color: "bg-orange-600", slug: "sports" },
  "شخصيات": { label: "شخصيات", color: "bg-blue-500", slug: "personalities" },
  "اقتصاد": { label: "اقتصاد", color: "bg-purple-600", slug: "economy" },
  "صحة": { label: "صحة", color: "bg-red-600", slug: "health" },
  "حوادث": { label: "حوادث", color: "bg-slate-700", slug: "accidents" },
};

export default async function Home({ searchParams }: HomeProps) {
  // 1. جلب كل الأخبار مرتبة من الأحدث
  const { data: allArticles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const latestSidebarArticles = (allArticles as Article[])?.slice(0, 5) || [];
  const tickerArticles = (allArticles as Article[])?.slice(0, 10) || [];

  // 2. تجهيز الأخبار لكل قسم مع تجنب استخدام any
  const featuredArticlesByCategory = (allArticles as Article[])?.reduce((acc: Record<string, Article[]>, article: Article) => {
    const cat = article.category || "عام";
    if (!acc[cat]) acc[cat] = [];
    // نأخذ حتى 10 أخبار لكل قسم لضمان وصول المنشور الجديد للسلايدر
    if (acc[cat].length < 10) acc[cat].push(article);
    return acc;
  }, {}) || {};

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-10 font-sans" dir="rtl">

      {/* شريط عاجل */}
      <div className="text-[12px] md:text-[18px]">
        <UrgentTicker articles={tickerArticles} />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-6">

        {/* --- السايدبار الأيمن --- */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[24px] p-6 border-2 border-gray-100 shadow-sm">
              <h2 className="flex items-center gap-3 font-black text-gray-900 mb-6 text-lg border-b-2 border-gray-50 pb-4">
                <Clock size={22} className="text-blue-600" /> أحدث النشر
              </h2>
              <div className="space-y-6">
                {latestSidebarArticles.map((item, index) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="group flex gap-4 items-start">
                    <span className="text-2xl font-black text-gray-100 group-hover:text-blue-600 transition-colors">{index + 1}</span>
                    <div className="space-y-1">
                      <h4 className="text-[14px] font-black text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-tight">{item.title}</h4>
                      <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-md">{item.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <AdSlider placement="sidebar" />
          </div>
        </aside>

        {/* --- المنتصف (المحتوى الرئيسي) --- */}
        <div className="col-span-1 lg:col-span-6 space-y-10">
          <div className="overflow-hidden rounded-3xl md:rounded-4xl">
            <HomeHeroSlider articlesByCategory={featuredArticlesByCategory} />
          </div>

          {Object.entries(categoriesMap).map(([categoryInDb, data], index) => {
            const sectionArticles = (allArticles as Article[])?.filter(a => a.category === categoryInDb).slice(0, 4) || [];
            if (sectionArticles.length === 0) return null;

            return (
              <div key={categoryInDb} className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-gray-100 pb-4">
                    <div className="flex items-center gap-2 md:gap-4">
                      <div className={`w-1.5 h-6 md:w-2 md:h-8 ${data.color} rounded-full`}></div>
                      <h2 className="text-lg md:text-2xl font-black text-gray-900">
                        {categoryInDb === "عاجل" ? (
                          <span className="flex items-center gap-2 text-red-600"><Zap size={20} fill="currentColor" /> {data.label}</span>
                        ) : (
                          `أخبار ${data.label}`
                        )}
                      </h2>
                    </div>
                    <Link href={`/category/${data.slug}`} className="text-[10px] md:text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                      عرض الكل
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                    {sectionArticles.map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>

                {(index + 1) % 2 === 0 && (
                  <div className="py-4 border-y border-gray-100/50">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">إعلان ممول</span>
                      <div className="h-[1px] bg-gray-100 flex-1"></div>
                    </div>
                    <AdSlider placement="between_sections" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --- السايدبار الأيسر --- */}
        <aside className="col-span-1 lg:col-span-3 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-[24px] border-2 border-gray-100 p-4 shadow-sm overflow-hidden">
              <h3 className="text-sm font-black text-gray-800 mb-4 px-2">دليل طامية التجاري</h3>
              <AdSlider placement="sidebar" />
            </div>

            <div className="hidden lg:block bg-[#1E293B] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="text-blue-500" size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3 text-right leading-tight">
                  أعلن معنا <br /> <span className="text-blue-500 text-lg">أو انشر خبرك</span>
                </h3>
                <p className="text-slate-400 text-[11px] font-bold mb-8 text-right leading-relaxed">
                  للإعلان في دليل طامية أو نشر الاستغاثات والمنشورات، تواصل معنا مباشرة.
                </p>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/2010XXXXXXXX"
                    target="_blank"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 group"
                  >
                    <MessageCircle size={20} />
                    <span>واتساب مباشر</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}