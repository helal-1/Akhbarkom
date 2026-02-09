import Link from "next/link";
import Image from "next/image";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    Globe,
    Code2
} from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const newsLinks = [
        { name: "الرئيسية", href: "/" },
        { name: "سياسة", href: "/category/politics" },
        { name: "رياضة", href: "/category/sports" },
        { name: "اقتصاد", href: "/category/economy" },
        { name: "صحة", href: "/category/health" },
        { name: "عاجل", href: "/category/urgent" },
        { name: "حوادث", href: "/category/Accidents" },
        { name: "شخصيات", href: "/category/Characters" },
    ];

    const firstGroup = newsLinks.slice(0, 5);
    const secondGroup = newsLinks.slice(5);

    const aboutLinks = [
        { name: "من نحن", href: "/about" },
        { name: "فريق العمل", href: "/team" },
        { name: "سياسة الخصوصية", href: "/privacy" },
        { name: "اتصل بنا", href: "/contact" },
    ];

    return (
        <footer className="bg-white border-t-2 border-gray-100 pt-16 pb-8" dir="rtl">
            <div className="max-w-[1500px] mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

                    {/* العمود 1: الهوية */}
                    <div className="lg:col-span-3 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-blue-100 shadow-xl border border-white">
                                <Image src="/logo.png" alt="لوجو أخباركم" fill className="object-cover" unoptimized />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-blue-600 text-2xl font-black leading-none">أخباركم</span>
                                <span className="text-[10px] text-gray-400 font-bold tracking-[0.3em]">NEWS PORTAL</span>
                            </div>
                        </Link>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            منصة إخبارية مصرية شاملة، تقدم لكم الخبر بكل مصداقية وحيادية على مدار الساعة.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { Icon: Facebook, color: "hover:bg-blue-600", href: "#" },
                                { Icon: Twitter, color: "hover:bg-sky-500", href: "#" },
                                { Icon: Instagram, color: "hover:bg-pink-600", href: "#" },
                                { Icon: Youtube, color: "hover:bg-red-600", href: "#" },
                            ].map((social, i) => (
                                <a key={i} href={social.href} className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 transition-all ${social.color} hover:text-white`}>
                                    <social.Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* الأعمدة الوسطى */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-gray-900 font-black mb-6 text-base border-r-4 border-blue-600 pr-3">الأقسام</h3>
                            <ul className="space-y-4">
                                {firstGroup.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2 group transition-all">
                                            <span className="w-1 h-1 rounded-full bg-gray-200 group-hover:bg-blue-600 transition-all"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-gray-900 font-black mb-6 text-base border-r-4 border-blue-600 pr-3">المزيد</h3>
                            <ul className="space-y-4">
                                {secondGroup.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2 group transition-all">
                                            <span className="w-1 h-1 rounded-full bg-gray-200 group-hover:bg-blue-600 transition-all"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-gray-900 font-black mb-6 text-base border-r-4 border-blue-600 pr-3">عن أخباركم</h3>
                            <ul className="space-y-4">
                                {aboutLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-500 hover:text-blue-600 font-bold text-sm flex items-center gap-2 group transition-all">
                                            <span className="w-1 h-1 rounded-full bg-gray-200 group-hover:bg-blue-600 transition-all"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* العمود الأخير: التواصل */}
                    <div className="lg:col-span-3 bg-blue-50/50 p-6 rounded-[24px] border border-blue-100/50 self-start">
                        <h3 className="text-blue-900 font-black mb-5 text-base flex items-center gap-2">
                            <Globe size={18} className="text-blue-600" /> تواصل معنا
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
                                    <Mail className="text-blue-600" size={14} />
                                </div>
                                <p className="text-gray-700 font-bold text-xs truncate">info@akhbarkom.com</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-50">
                                    <Phone className="text-blue-600" size={14} />
                                </div>
                                <p className="text-gray-700 font-bold text-xs" dir="ltr">+20 123 456 7890</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* الجزء السفلي: الحقوق + زر المطور الجديد */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-gray-400 font-bold text-xs text-center md:text-right">
                        © {currentYear} <span className="text-blue-600">أخباركم</span>. جميع الحقوق محفوظة.
                    </p>

                    {/* --- قسم المطور المضاف --- */}
                    <Link href="/developer" className="group flex items-center gap-4 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 px-5 py-2.5 rounded-2xl border border-gray-100 transition-all duration-300">
                        <div className="flex flex-col text-left md:text-right">
                            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Developer</span>
                            <span className="text-sm font-black text-gray-800 group-hover:text-blue-600 transition-colors">م/ محمد هلال</span>
                        </div>
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                            <Image
                                src="/developer.jpeg"
                                alt="المطور"
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all border border-gray-50 shadow-sm">
                            <Code2 size={16} />
                        </div>
                    </Link>
                </div>

            </div>
        </footer>
    );
}