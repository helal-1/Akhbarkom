import { supabase } from "@/lib/supabase";
import Image from "next/image";
import {
  Clock,
  User,
  ArrowRight,
  Calendar,
  Tag,
  Eye,
  Share2,
  Sparkles,
  Bookmark,
  Newspaper,
  Star,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import AdSlider from "@/components/AdSlider";
import { notFound } from "next/navigation";

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .or(`slug.eq."${decodedSlug}",id.eq."${decodedSlug}"`)
    .maybeSingle();

  if (!article) {
    const { data: retryArticle } = await supabase
      .from("articles")
      .select("*")
      .ilike('slug', decodedSlug)
      .maybeSingle();

    if (!retryArticle) return notFound();
    return renderContent(retryArticle);
  }

  return renderContent(article);
}

async function renderContent(article: any) {
  const currentViews = article.views || 0;
  await supabase.from("articles").update({ views: currentViews + 1 }).eq("id", article.id);

  // جلب أخبار ذات صلة للسايدبار الأيمن
  const { data: relatedNews } = await supabase
    .from("articles")
    .select("id, title, image_url, slug")
    .eq("category", article.category)
    .neq("id", article.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-[#FDFDFD]" dir="rtl">
      {/* 1. الهيدر العلوى */}
      <div className="bg-white sticky top-0 z-40 py-4 border-b-2 border-gray-100 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold">الرئيسية</Link>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-2 text-blue-700 font-black text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
              <Tag size={14} /> {article.category}
            </div>
          </div>
          <Link href={`/category/${article.category}`} className="text-blue-600 font-black text-sm flex items-center gap-1 hover:gap-2 transition-all">
            المزيد من {article.category} <ArrowRight size={16} className="rotate-180" />
          </Link>
        </div>
      </div>

      {/* 2. الحاوية الرئيسية - تقسيم 3 أعمدة */}
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- [السايدبار الأيمن الجديد] --- */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-28 space-y-6">

              {/* كرت الكاتب */}
              <div className="bg-white p-6 rounded-[24px] border-2 border-gray-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-100 shadow-inner">
                  <User size={32} />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{article.author_name || "محرر أخبارك"}</h3>
                <p className="text-gray-400 text-[11px] font-bold">محرر متخصص في {article.category}</p>
              </div>

              {/* أخبار قد تهمك */}
              <div className="bg-white rounded-[24px] border-2 border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b-2 border-gray-50 bg-gray-50/50">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Star className="text-orange-500 fill-orange-500" size={16} /> قد يهمك أيضاً
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {relatedNews?.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="group flex gap-3 items-center">
                      <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <Image src={item.image_url || "/placeholder.jpg"} alt="" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized />
                      </div>
                      <h4 className="text-[11px] font-black text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-700">
                        {item.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>

              {/* زر واتساب السريع */}
              <div className="relative bg-[#075E54] rounded-[24px] p-5 overflow-hidden group shadow-lg shadow-green-100/50">
                <MessageCircle className="absolute -right-4 -bottom-4 text-white/10 rotate-12" size={80} />
                <div className="relative z-10 text-white">
                  <h4 className="text-sm font-black mb-3">تابع عاجل {article.category}</h4>
                  <a href="https://wa.me/your_number" target="_blank" className="w-full bg-white text-[#075E54] py-2.5 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
                    اشترك الآن <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* --- [المحتوى الرئيسي] --- */}
          <main className="lg:col-span-6">
            <article className="bg-white border-2 border-gray-200 rounded-[32px] overflow-hidden shadow-sm">
              {/* صورة الخبر الكبيرة */}
              <div className="relative aspect-video w-full border-b-2 border-gray-100">
                <Image
                  src={article.image_url || "/placeholder.jpg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>

              <div className="p-6 md:p-10">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-[1.4] mb-6">
                  {article.title}
                </h1>

                <div className="flex items-center gap-4 pb-6 mb-8 border-b border-gray-100 text-gray-400 font-bold text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-blue-600" />
                    {new Date(article.created_at).toLocaleDateString("ar-EG")}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} className="text-blue-600" />
                    {currentViews + 1} مشاهدة
                  </div>
                </div>

                <div className="text-[#374151] leading-[2] text-lg md:text-xl font-medium whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>
            </article>
          </main>

          {/* --- [السايدبار الأيسر] --- */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* كرت الإعلان */}
              <div className="bg-white rounded-[24px] border-2 border-gray-200 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">إعلان ممول</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                </div>
                <AdSlider />
              </div>

              {/* النشرة البريدية */}
              <div className="bg-gray-900 rounded-[24px] p-6 text-white border-2 border-gray-800 shadow-xl">
                <h3 className="text-base font-black mb-2">النشرة الإخبارية</h3>
                <p className="text-gray-400 text-[10px] mb-4">احصل على ملخص يومي لأهم أخبار {article.category}.</p>
                <div className="space-y-3">
                  <input className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-blue-500" placeholder="بريدك الإلكتروني" />
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 rounded-xl text-xs transition-all border-b-4 border-blue-800">سجلني الآن</button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}