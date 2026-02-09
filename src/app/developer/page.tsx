"use client"; // نحتاجه لأننا سنستخدم Framer Motion للأنيميشن
import React from "react";
import Image from "next/image";
import { Github, Linkedin, Mail, Twitter, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface SocialLinkProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    color: string;
}

export default function DeveloperPage() {
    return (
        <main className="relative min-h-screen w-full bg-[#0f172a] flex items-center justify-center overflow-hidden p-6" dir="rtl">

            {/* 1. الخلفية الفنية (Animated Blobs) */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

            {/* 2. بطاقة المطور (Glassmorphism Card) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-4xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden"
            >
                {/* لمعة الزجاج العلوية */}
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

                <div className="flex flex-col md:flex-row items-center gap-10">

                    {/* صورة المطور مع إطار مضيء */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-[32px] blur-sm opacity-25 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[30px] overflow-hidden border border-white/20">
                            <Image
                                src="/developer.jpeg"
                                alt="م/ هلال"
                                width={224}
                                height={224}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* محتوى النص */}
                    <div className="flex-1 text-center md:text-right space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                م/ محمد هلال <span className="text-blue-500 text-2xl md:text-3xl font-normal">.</span>
                            </h1>
                            <p className="text-blue-400 font-bold text-lg">Senior Frontend Developer</p>
                        </div>

                        <p className="text-slate-300 text-lg leading-relaxed font-medium">
                            مطور برمجيات متخصص في بناء المنصات الرقمية عالية الأداء. قمت بتطوير منصة
                            <span className="text-white font-bold"> &quot;أخباركم&quot; </span>
                            بأحدث التقنيات لتقديم تجربة إخبارية تجمع بين السرعة الفائقة والتصميم العصري.
                        </p>

                        {/* أزرار التواصل */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <SocialLink href="#" icon={<Github size={22} />} label="Github" color="hover:bg-slate-800" />
                            <SocialLink href="#" icon={<Linkedin size={22} />} label="Linkedin" color="hover:bg-blue-700" />
                            <SocialLink href="#" icon={<Twitter size={22} />} label="Twitter" color="hover:bg-sky-500" />
                            <SocialLink href="mailto:contact@helal.me" icon={<Mail size={22} />} label="Email" color="hover:bg-red-600" />
                        </div>

                        {/* زر خارجي للبروفايل الكامل */}
                        <div className="pt-6 border-t border-white/5">
                            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold mx-auto md:mx-0">
                                <span>استكشاف كافة المشاريع</span>
                                <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* لمسة فنية أخيرة (Noise Texture) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </main>
    );
}

function SocialLink({ href, icon, label, color }: SocialLinkProps) {
    return (
        <motion.a
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            href={href}
            aria-label={label}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition-all duration-300 ${color} shadow-lg`}
        >
            {icon}
        </motion.a>
    );
}