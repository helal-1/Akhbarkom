import { supabase } from "@/lib/supabase";
import NewsCard from "@/components/ui/NewsCard";
import { Hash, Newspaper, Info, ArrowRight, Star, ExternalLink, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AdSlider from "@/components/AdSlider";

interface PageProps {
  params: Promise<{ categoryName: string }>;
  searchParams: Promise<{ page?: string }>;
}

// 1. توحيد الاسم هنا (تأكد من مطابقة الحروف الكبيرة والصغيرة مع الـ Navbar)
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

  // 2. استخدام الاسم الصحيح للمتغير هنا
  const dbCategoryName = categoriesMap[categorySlug] || categorySlug;

  const currentPage = Number(resolvedSearchParams.page) || 1;
  const pageSize = 5;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  // جلب المقالات
  const { data: articles, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .eq("category", dbCategoryName)
    .order("created_at", { ascending: false })
    .range(from, to);

  // جلب مختارات المحرر
  const { data: editorsPicks } = await supabase
    .from("articles")
    .select("id, title, image_url, slug")
    .eq("category", dbCategoryName)
    .order("created_at", { ascending: false })
    .limit(2);

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-10" dir="rtl">
      {/* رأس الصفحة */}
      <div className="bg-white border-b-2 border-gray-200 mb-8 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-6 py-10">
          <Link href="/" className="flex items-center gap-2 text-blue-600 text-sm font-black mb-6 hover:gap-3 transition-all w-fit">
            <ArrowRight size={18} /> العودة للرئيسية
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shadow-xl border-b-4 border-blue-800">
              <Hash size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{dbCategoryName}</h1>
              <div className="flex items-center gap-2 text-gray-500 font-bold">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                تغطية مباشرة لآخر مستجدات {dbCategoryName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* الجانب الأيمن */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white p-6 rounded-[24px] border-2 border-gray-200 shadow-sm">
              <h2 className="flex items-center gap-2 font-black text-gray-900 mb-4 border-b-2 border-gray-50 pb-3 text-base">
                <Info size={20} className="text-blue-600" /> عن القسم
              </h2>
              <p className="text-sm text-gray-600 font-bold leading-relaxed">
                هنا تجد كافة التقارير والأخبار المتعلقة بـ {dbCategoryName}، يتم تحديث المحتوى على مدار الساعة.
              </p>
            </div>

            <div className="bg-white rounded-[24px] border-2 border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b-2 border-gray-50 bg-gray-50/50">
                <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <Star className="text-orange-500 fill-orange-500" size={18} /> مختارات المحرر
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

        {/* المنتصف */}
        <div className="lg:col-span-6 space-y-4">
          {articles && articles.length > 0 ? (
            <>
              {articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
              {/* الترقيم */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 py-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <Link key={n} href={`/category/${categorySlug}?page=${n}`} className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold ${currentPage === n ? "bg-blue-600 text-white" : "bg-white border text-gray-400"}`}>
                      {n}
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed">
              <Newspaper size={80} className="mx-auto text-gray-100 mb-4" />
              <p className="text-gray-400 font-black">لا توجد أخبار في هذا القسم حالياً.</p>
            </div>
          )}
        </div>

        {/* الجانب الأيسر */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-[24px] border-2 border-gray-200 p-2 shadow-sm">
              <AdSlider />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}