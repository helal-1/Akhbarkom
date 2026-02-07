"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BackToTop from "@/components/BackToTop";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // التحقق من المسارات (الداشبورد، اللوجن، والريجستر)
    const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
    const isAuthPage = pathname === "/login" || pathname === "/register";

    // لو في صفحة دخول أو لوحة تحكم، هنخفي الـ UI العادي
    const hideUI = isDashboard || isAuthPage;

    return (
        <>
            {!hideUI && <Navbar />}

            <main className={!hideUI ? "min-h-screen " : ""}>
                {children}
            </main>

            {!hideUI && (
                <>
                    <Footer />
                    <BackToTop />
                </>
            )}
        </>
    );
}