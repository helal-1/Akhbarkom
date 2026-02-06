"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // مراقبة التمرير لإظهار أو إخفاء الزر
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 left-8 z-[60] bg-blue-600 text-white w-12 h-12 rounded-2xl shadow-2xl shadow-blue-200 flex items-center justify-center hover:bg-blue-700 hover:-translate-y-2 transition-all duration-300 active:scale-90 group"
                    aria-label="العودة للأعلى"
                >
                    <ArrowUp
                        size={24}
                        className="group-hover:animate-bounce"
                    />
                </button>
            )}
        </>
    );
}