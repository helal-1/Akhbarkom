import { supabase } from "@/lib/supabase";
import Image from "next/image";
import {
  User,
  ArrowRight,
  Calendar,
  Tag,
  Eye,
  Star,
  MessageCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import AdSlider from "@/components/AdSlider";
import { notFound } from "next/navigation";

// 1. تعريف شكل بيانات المقال
interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  author_name?: string;
  views: number;
  slug: string;
  created_at: string;
}

// 2. تعريف شكل الأخبار المتعلقة (نسخة مختصرة)
interface RelatedArticle {
  id: string;
  title: string;
  image_url: string;
  slug: string;
}

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
    return renderPageContent(retryArticle);
  }

  return renderPageContent(article);
}

async function renderPageContent(article: Article) {
  const currentViews = article.views || 0;

  // تحديث المشاهدات في الخلفية
  await supabase.from("articles").update({ views: currentViews + 1 }).eq("id", article.id);

  // جلب أخبار ذات صلة
  const { data: relatedNews } = await supabase
    .from("articles")
    .select("id, title, image_url, slug")
    .eq("category", article.category)
    .neq("id", article.id)
    .limit(3);

  // تحويل البيانات لنوعها الصحيح
  const typedRelatedNews = (relatedNews as RelatedArticle[]) || [];

  return (
    <div className="min-h-screen bg-[#FDFDFD]" dir="rtl">
      {/* هيدر التنقل */}
      <div className="bg-white sticky top-0 z-40 py-3 md:py-4 border-b border-gray-100 shadow-sm">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors text-xs md:text-sm font-bold shrink-0">الرئيسية</Link>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-1.5 text-blue-700 font-black text-[10px] md:text-xs bg-blue-50 px-2 md:px-3 py-1 rounded-lg border border-blue-100 truncate">
              <Tag size={12} className="shrink-0" /> {article.category}
            </div>
          </div>
          <Link href={`/category/${article.category}`} className="text-blue-600 font-black text-[10px] md:text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0">
            المزيد من {article.category} <ArrowRight size={14} className="rotate-180" />
          </Link>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* السايدبار الأيمن (يظهر أسفل المقال في الموبايل) */}
          <aside className="order-2 lg:order-1 lg:col-span-3 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-white p-6 rounded-[24px] border border-gray-200 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
                  <User size={32} />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{article.author_name || "محرر أخبارك"}</h3>
                <p className="text-gray-400 text-[11px] font-bold">محرر متخصص في {article.category}</p>
              </div>

              <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
                    <Star className="text-orange-500 fill-orange-500" size={16} /> قد يهمك أيضاً
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {typedRelatedNews.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="group flex gap-3 items-center">
                      <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        <Image src={item.image_url || "/placeholder.jpg"} alt="" fill className="object-cover group-hover:scale-110 transition-transform" unoptimized />
                      </div>
                      <h4 className="text-[12px] font-black text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-700">
                        {item.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* المحتوى الرئيسي */}
          <main className="order-1 lg:order-2 lg:col-span-6">
            <article className="bg-white border border-gray-200 rounded-[24px] md:rounded-[32px] overflow-hidden">
              <div className="relative aspect-video w-full">
                <Image src={article.image_url || "/placeholder.jpg"} alt={article.title} fill className="object-cover" priority unoptimized />
              </div>

              <div className="p-5 md:p-10">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-[1.4] mb-6">{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-gray-100 text-gray-400 font-bold text-xs">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full text-[10px] md:text-xs">
                    <Calendar size={14} className="text-blue-600" />
                    {new Date(article.created_at).toLocaleDateString("ar-EG")}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full text-[10px] md:text-xs">
                    <Eye size={14} className="text-blue-600" />
                    {currentViews + 1} مشاهدة
                  </div>
                </div>

                <div className="text-[#374151] leading-[1.8] md:leading-[2] text-lg md:text-xl font-medium whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>
            </article>
          </main>

          {/* السايدبار الأيسر (إعلانات ونشرة) */}
          <aside className="order-3 lg:col-span-3 space-y-6">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-[24px] border border-gray-200 p-3">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-[10px] font-black text-gray-400">إعلان ممول</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                </div>
                <AdSlider />
              </div>

              <div className="bg-gray-900 rounded-[24px] p-6 text-white">
                <h3 className="text-base font-black mb-2">النشرة الإخبارية</h3>
                <p className="text-gray-400 text-[10px] mb-4">اشترك ليصلك أهم أخبار {article.category} يومياً.</p>
                <div className="space-y-3">
                  <input className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-blue-500" placeholder="بريدك الإلكتروني" />
                  <button className="w-full bg-blue-600 text-white font-black py-2.5 rounded-xl text-xs transition-all">سجلني الآن</button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}