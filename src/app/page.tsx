import { supabase } from "@/lib/supabase";
import NewsCard from "@/components/ui/NewsCard";
import AdSlider from "@/components/AdSlider";
import Link from "next/link";
import HomeHeroSlider from "@/components/HomeHeroSlider";
import UrgentTicker from "@/components/UrgentTicker";

import {
  Flame,
  Zap,
  UserCircle,
  Newspaper
} from "lucide-react";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

const categoriesMap: Record<string, { label: string; color: string; slug: string }> = {
  "عاجل": { label: "أخبار عاجلة", color: "bg-red-600", slug: "urgent" },
  "سياسة": { label: "سياسة", color: "bg-emerald-600", slug: "politics" },
  "رياضة": { label: "رياضة", color: "bg-orange-600", slug: "sports" },
  "شخصيات": { label: "شخصيات", color: "bg-blue-500", slug: "personalities" },
  "تكنولوجيا": { label: "تكنولوجيا", color: "bg-blue-600", slug: "tech" },
  "اقتصاد": { label: "اقتصاد", color: "bg-purple-600", slug: "economy" },
  "صحة": { label: "صحة", color: "bg-red-600", slug: "health" },
  "حوادث": { label: "حوادث", color: "bg-slate-700", slug: "accidents" },
};

export default async function Home({ searchParams }: HomeProps) {
  const { data: allArticles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: trendingArticles } = await supabase
    .from("articles")
    .select("id, title, views, category, slug")
    .order("views", { ascending: false })
    .limit(5);

  const tickerArticles = allArticles?.slice(0, 10) || [];

  const featuredArticlesByCategory = allArticles?.reduce((acc: Record<string, any[]>, article) => {
    const cat = article.category;
    if (!acc[cat]) acc[cat] = [];
    if (acc[cat].length < 3) acc[cat].push(article);
    return acc;
  }, {}) || {};

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-10 font-sans" dir="rtl">

      {/* شريط عاجل - Responsive بطبعه داخل المكون */}
      <UrgentTicker articles={tickerArticles} />

      {/* الحاوية الرئيسية: نستخدم px-4 في الموبايل و px-6 في الشاشات الأكبر */}
      <div className="max-w-[1500px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* --- السايدبار الأيمن (ترند) --- 
            يختفي في الموبايل ويظهر فقط من شاشة lg (1024px) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[24px] p-6 border-2 border-gray-100 shadow-sm">
              <h2 className="flex items-center gap-3 font-black text-gray-900 mb-6 text-lg border-b-2 border-gray-50 pb-4">
                <Flame size={22} className="text-orange-500" /> ترند الآن
              </h2>
              <div className="space-y-6">
                {trendingArticles?.map((item, index) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="group flex gap-4 items-start">
                    <span className="text-2xl font-black text-gray-200 group-hover:text-blue-600 transition-colors">{index + 1}</span>
                    <div className="space-y-1">
                      <h4 className="text-[14px] font-black text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-tight">{item.title}</h4>
                      <span className="text-[11px] text-gray-400 font-bold">{item.views.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* --- المنتصف (المحتوى الرئيسي) --- 
            يأخذ 12 عمود في الموبايل و 6 في الشاشات الكبيرة */}
        <div className="col-span-1 lg:col-span-6 space-y-10 md:space-y-16">

          {/* السلايدر الرئيسي - تأكد أن مكون HomeHeroSlider مستخدم فيه swiper responsive */}
          <div className="overflow-hidden rounded-[24px] md:rounded-[32px]">
            <HomeHeroSlider articlesByCategory={featuredArticlesByCategory} />
          </div>

          {/* عرض الأقسام */}
          {Object.entries(categoriesMap).map(([categoryInDb, data]) => {
            const sectionArticles = allArticles?.filter(a => a.category === categoryInDb).slice(0, 4) || [];
            if (sectionArticles.length === 0) return null;

            return (
              <section key={categoryInDb} className="space-y-6 md:space-y-8">
                {/* رأس القسم Responsive */}
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
                  <Link
                    href={`/category/${data.slug}`}
                    className="text-[10px] md:text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                  >
                    عرض الكل
                  </Link>
                </div>

                {/* شبكة الأخبار - NewsCard نفسه لازم يكون جواه flex-col في الموبايل */}
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {sectionArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* --- الجانب الأيسر --- 
            يظهر في الشاشات الكبيرة فقط، وفي الموبايل ممكن نظهر الإعلانات في النص */}
        <aside className="col-span-1 lg:col-span-3 space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">

            {/* الإعلان يظهر للكل لكن بتنسيق مختلف */}
            <div className="bg-white rounded-[24px] border-2 border-gray-100 p-2 shadow-sm">
              <div className="text-[10px] font-black text-gray-300 text-center py-1 uppercase tracking-widest">إعلان</div>
              <AdSlider />
            </div>

            {/* النشرة البريدية تختفي في الموبايل لتوفير مساحة أو تظهر في الآخر */}
            <div className="hidden lg:block bg-gray-900 rounded-[24px] p-8 text-white relative overflow-hidden">
              <Newspaper className="mb-4 opacity-20" size={48} />
              <h3 className="text-xl font-black mb-2 text-right">النشرة البريدية</h3>
              <p className="text-gray-400 text-xs font-bold mb-6 text-right">أهم الأخبار في بريدك.</p>
              <button className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition-all">
                اشترك الآن
              </button>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}