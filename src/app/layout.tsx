import { Providers } from "@/components/Providers";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";
import Footer from "@/components/ui/Footer";
import BackToTop from "@/components/BackToTop";
import LayoutContent from "@/components/LayoutContent"; // هننقل منطق الـ Pathname هنا

export const metadata = {
  title: "أخباركم - بوابة إخبارية شاملة",
  description: "تابع أحدث الأخبار العالمية والمحلية لحظة بلحظة",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#F0F2F5] text-gray-900 antialiased font-sans">
        <Providers>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Providers>
      </body>
    </html>
  );
}