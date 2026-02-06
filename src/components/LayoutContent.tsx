"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import BackToTop from "@/components/BackToTop";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // هل إحنا في صفحة لوحة التحكم أو صفحة اللوجن؟
    const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
    const isLoginPage = pathname === "/login";

    // لو في اللوجن أو الداشبورد مش عايزين النوافبار والفوتر العاديين
    const hideUI = isDashboard || isLoginPage;

    return (
        <>
            {!hideUI && <Navbar />}

            <main className={!hideUI ? "min-h-screen" : ""}>
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