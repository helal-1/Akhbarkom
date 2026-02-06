import { supabase } from "@/lib/supabase";
import NewsCard from "@/components/ui/NewsCard";
import AdSlider from "@/components/AdSlider";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Newspaper, LayoutGrid, Flame, CalendarDays, Sparkles } from "lucide-react";

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

const categoriesMap: Record<string, string> = {
  politics: "سياسة",
  sports: "رياضة",
  tech: "تكنولوجيا",
  economy: "اقتصاد",
  health: "صحة",
  urgent: "عاجل",
  Accidents: "حوادث",
  Characters: "شخصيات",
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const pageSize = 5;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: articles, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: trendingArticles } = await supabase
    .from("articles")
    .select("id, title, views, category, slug")
    .order("views", { ascending: false })
    .limit(5);

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-20 font-sans" dir="rtl">

      {/* 1. الهيدر الترحيبي - عرض عريض وحدود واضحة */}
      <div className="bg-white border-b-2 border-gray-200 mb-8 py-3">
        <div className="max-w-[1500px] mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-tight">
            <Sparkles size={16} />
            مرحباً بك في أخباركم
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-bold border-r-2 border-gray-100 pr-4">
            <CalendarDays size={16} className="text-blue-600" />
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* 2. الحاوية الرئيسية - Max-Width 1500px لتقليل المساحات الجانبية */}
      <div className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* السايدبار الأيمن - ترند الآن (حدود حادة) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">

            <div className="bg-white rounded-[24px] p-6 border-2 border-gray-200 shadow-sm relative overflow-hidden">
              <h2 className="flex items-center gap-3 font-black text-gray-900 mb-6 text-lg border-b-2 border-gray-50 pb-4">
                <Flame size={22} className="text-orange-500" />
                ترند الآن
              </h2>
              <div className="space-y-6">
                {trendingArticles?.map((item, index) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="group flex gap-4 items-start">
                    <span className="text-2xl font-black text-gray-200 group-hover:text-blue-600 transition-colors">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-[14px] font-black text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-bold">{item.views.toLocaleString()} مشاهدة</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* الأقسام - حدود واضحة */}
            <div className="bg-white rounded-[24px] p-6 border-2 border-gray-200 shadow-sm">
              <h2 className="flex items-center gap-3 font-black text-gray-900 mb-6 text-lg">
                <LayoutGrid size={22} className="text-blue-700" />
                الأقسام
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {Object.keys(categoriesMap).map((slug) => (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className="flex items-center justify-between py-3 px-4 bg-gray-100 rounded-xl border-2 border-transparent hover:border-blue-600 hover:bg-blue-50 text-[14px] font-black text-gray-700 transition-all group"
                  >
                    {categoriesMap[slug]}
                    <ChevronLeft size={16} className="text-blue-600" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 3. المنتصف - محتوى الأخبار (أصبح أعرض) */}
        
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between mb-4 border-b-2 border-gray-500 pb-4">
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="w-2.5 h-10 bg-blue-600 rounded-full"></div>
              آخر الأخبار
            </h2>
          </div>

          <div className="space-y-4 border-2 border-gray-100 rounded-[24px] p-4">
            {articles?.map((article) => (
              /* تأكد أن مكون NewsCard نفسه يستخدم border-2 border-gray-200 */
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* الترقيم */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 py-10">
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border-2 border-gray-200 shadow-sm">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/?page=${pageNum}`}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl font-black transition-all ${currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:bg-gray-100"
                      }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. الجانب الأيسر - إعلانات (حدود واضحة) */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[24px] border-2 border-gray-200 p-2 shadow-sm">
              <AdSlider />
            </div>

            <div className="bg-blue-600 rounded-[24px] p-8 text-white border-2 border-blue-700 shadow-lg relative overflow-hidden group">
              <Newspaper className="mb-4 opacity-40 group-hover:rotate-12 transition-transform duration-500" size={48} />
              <h3 className="text-2xl font-black mb-2">اشترك الآن</h3>
              <p className="text-blue-100 text-sm font-medium mb-6">كن أول من يصله تنبيه بالخبر العاجل.</p>
              <button className="w-full bg-white text-blue-700 font-black py-3.5 rounded-xl hover:bg-blue-50 transition-colors">
                انضم إلينا
              </button>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}