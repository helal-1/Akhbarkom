import { supabase } from "@/lib/supabase";
import NewsCard from "@/components/ui/NewsCard";
import { Hash, Newspaper, Info, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AdSlider from "@/components/AdSlider";

interface PageProps {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<{ page?: string }>;
}

const categoriesMap: Record<string, string> = {
  health: "صحة",
  urgent: "عاجل",
  Accidents: "حوادث",
  Characters: "شخصيات",
  politics: "سياسة",
  sports: "رياضة",
  economy: "اقتصاد"
};

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const categorySlug = decodeURIComponent(resolvedParams.categoryName);
  const dbCategoryName = categoriesMap[categorySlug] || categorySlug;

  const currentPage = Number(resolvedSearchParams.page) || 1;
  const pageSize = 5;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: articles, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("category", dbCategoryName)
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: editorsPicks } = await supabase
    .from("articles")
    .select("id, title, image_url, slug")
    .eq("category", dbCategoryName)
    .order("created_at", { ascending: false })
    .limit(3);

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-10" dir="rtl">
      {/* Header Section - Responsive Padding & Text */}
      <div className="bg-white border-b border-gray-200 mb-6 md:mb-8 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-6 md:py-10">
          <Link href="/" className="flex items-center gap-2 text-blue-600 text-xs md:text-sm font-black mb-4 md:mb-6 hover:gap-3 transition-all w-fit">
            <ArrowRight size={16} className="md:w-[18px]" /> العودة للرئيسية
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-14 h-14 md:w-20 md:h-20 bg-blue-600 rounded-2xl md:rounded-[24px] flex items-center justify-center text-white shadow-xl border-b-4 border-blue-800 shrink-0">
              <Hash className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2 truncate">{dbCategoryName}</h1>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs md:text-base">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></div>
                تغطية مستمرة لقسم {dbCategoryName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Right Sidebar - Hidden on mobile/tablet, visible on LG */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
              <h2 className="flex items-center gap-2 font-black text-gray-900 mb-4 border-b border-gray-50 pb-3 text-base">
                <Info size={20} className="text-blue-600" /> عن القسم
              </h2>
              <p className="text-sm text-gray-600 font-bold leading-relaxed">
                هنا تجد كافة التقارير والأخبار المتعلقة بـ {dbCategoryName}، يتم تحديث المحتوى على مدار الساعة.
              </p>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Star className="text-orange-500 fill-orange-500" size={18} /> مختارات القسم
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {editorsPicks?.map((pick) => (
                  <Link key={pick.id} href={`/news/${pick.slug}`} className="group flex gap-3">
                    <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <Image src={pick.image_url || "/placeholder.png"} alt="" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized />
                    </div>
                    <h4 className="text-xs font-black text-gray-800 line-clamp-2 group-hover:text-blue-700">{pick.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed - Full width on mobile, 6 cols on LG */}
        <div className="col-span-1 lg:col-span-6 space-y-4">
          {articles && articles.length > 0 ? (
            <>
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}

              {/* Pagination - Responsive Sizing */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 py-8 md:py-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <Link
                      key={n}
                      href={`/category/${categorySlug}?page=${n}`}
                      className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-xl font-bold transition-all ${currentPage === n ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white border border-gray-200 text-gray-400 hover:border-blue-300"
                        }`}
                    >
                      {n}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 md:py-32 bg-white rounded-[24px] md:rounded-[32px] border-2 border-dashed border-gray-100 px-6">
              <Newspaper size={64} className="mx-auto text-gray-200 mb-4 md:w-20 md:h-20" />
              <p className="text-gray-400 font-black text-lg">لا توجد أخبار في قسم {dbCategoryName} حالياً.</p>
            </div>
          )}
        </div>

        {/* Left Sidebar (Ads) - Order changes on mobile */}
        <aside className="col-span-1 lg:col-span-3 order-first lg:order-last mb-6 lg:mb-0">
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-[24px] border border-gray-200 p-2 shadow-sm">
              <AdSlider />
            </div>

            {/* Mobile Editors Picks - Show only on small screens */}
            <div className="lg:hidden mt-6 bg-white rounded-[24px] border border-gray-200 p-4 shadow-sm">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 mb-4">
                <Star className="text-orange-500 fill-orange-500" size={16} /> أهم أخبار القسم
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {editorsPicks?.slice(0, 2).map((pick) => (
                  <Link key={pick.id} href={`/news/${pick.slug}`} className="flex gap-3">
                    <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={pick.image_url || "/placeholder.png"} alt="" fill className="object-cover" unoptimized />
                    </div>
                    <h4 className="text-[11px] font-black text-gray-800 line-clamp-2">{pick.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}