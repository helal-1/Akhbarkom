"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Mail, Trash2, User,
    MessageSquare, Loader2, Send,
    Clock, Smartphone, RefreshCw, ChevronRight
} from "lucide-react";

interface Message {
    id: string;
    created_at: string;
    full_name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
}

export default function AdminMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
    const [showListOnMobile, setShowListOnMobile] = useState(true);

    const handleManualRefresh = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("contact_messages")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error) setMessages(data || []);
        setLoading(false);
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error) setMessages(data || []);
            setLoading(false);
        };

        loadInitialData();
        const channel = supabase
            .channel('realtime_contact_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [newMessage, ...prev]);
                }).subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const markAsRead = async (id: string) => {
        const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
        if (!error) setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذه الرسالة نهائياً؟")) return;
        const { error } = await supabase.from("contact_messages").delete().eq("id", id);
        if (!error) {
            setMessages(prev => prev.filter(m => m.id !== id));
            setSelectedMsg(null);
            setShowListOnMobile(true);
        }
    };

    const handleSelectMessage = (msg: Message) => {
        setSelectedMsg(msg);
        if (!msg.is_read) markAsRead(msg.id);
        setShowListOnMobile(false); // إخفاء القائمة في الموبايل عند اختيار رسالة
    };

    if (loading) {
        return (
            <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-400 font-bold animate-pulse">جاري فحص صندوق الوارد...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-700 max-w-full overflow-x-hidden" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
                        <Mail size={24} className="md:hidden" />
                        <Mail size={28} className="hidden md:block" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800">بريد الاستفسارات</h2>
                        <p className="text-slate-400 text-xs md:text-sm font-bold">
                            لديك <span className="text-blue-600 font-black">{messages.filter(m => !m.is_read).length}</span> غير مقروءة
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleManualRefresh}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 md:px-5 md:py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95 text-sm md:text-base"
                >
                    <RefreshCw size={18} /> تحديث
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)] relative">
                {/* القائمة (تختفي في الموبايل عند اختيار رسالة) */}
                <div className={`lg:col-span-4 space-y-3 overflow-y-auto pl-2 custom-scrollbar pb-10 ${!showListOnMobile ? 'hidden lg:block' : 'block'}`}>
                    {messages.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-8 md:p-12 text-center">
                            <MessageSquare className="mx-auto text-slate-200 mb-4" size={40} />
                            <p className="text-slate-400 font-black text-sm">لا توجد رسائل حالياً</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => handleSelectMessage(msg)}
                                className={`group cursor-pointer p-4 md:p-5 rounded-[24px] border-2 transition-all relative ${selectedMsg?.id === msg.id
                                    ? "bg-white border-blue-600 shadow-xl lg:translate-x-2"
                                    : "bg-white/60 border-transparent hover:border-slate-200 shadow-sm"
                                    }`}
                            >
                                {!msg.is_read && (
                                    <span className="absolute top-4 left-4 w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-md"></span>
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-black text-sm truncate max-w-[120px] sm:max-w-[200px] ${selectedMsg?.id === msg.id ? "text-blue-600" : "text-slate-800"}`}>
                                        {msg.full_name}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                                        <Clock size={12} /> {new Date(msg.created_at).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-slate-500 line-clamp-1">{msg.subject}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* عرض التفاصيل (يأخذ الشاشة كاملة في الموبايل عند اختيار رسالة) */}
                <div className={`lg:col-span-8 h-full ${showListOnMobile ? 'hidden lg:block' : 'block'}`}>
                    {selectedMsg ? (
                        <div className="bg-white h-full rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            {/* Toolbar التفاصيل */}
                            <div className="p-4 md:p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                                <div className="flex items-center gap-3 md:gap-4">
                                    {/* زر الرجوع للموبايل فقط */}
                                    <button onClick={() => setShowListOnMobile(true)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded-lg">
                                        <ChevronRight size={24} />
                                    </button>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100 shrink-0">
                                        <User className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-slate-400 font-black uppercase truncate">المرسل</p>
                                        <p className="text-sm md:text-lg font-black text-slate-800 truncate">{selectedMsg.full_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteMessage(selectedMsg.id)}
                                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                                >
                                    <Trash2 size={22} />
                                </button>
                            </div>

                            {/* محتوى الرسالة */}
                            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                                    <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                                        <p className="text-[10px] text-slate-400 font-black mb-1 uppercase">البريد الإلكتروني</p>
                                        <p className="text-xs md:text-sm font-bold text-slate-700 break-all select-all">{selectedMsg.email}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                                        <p className="text-[10px] text-slate-400 font-black mb-1 uppercase">الموضوع</p>
                                        <p className="text-xs md:text-sm font-bold text-slate-700">{selectedMsg.subject}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs text-slate-400 font-black flex items-center gap-2 px-1">
                                        <MessageSquare size={16} className="text-blue-500" /> نص الرسالة
                                    </p>
                                    <div className="bg-blue-50/20 p-5 md:p-8 rounded-[20px] md:rounded-[24px] text-slate-700 font-medium leading-relaxed border border-blue-50 text-sm md:text-base shadow-inner whitespace-pre-wrap">
                                        {selectedMsg.message}
                                    </div>
                                </div>
                            </div>

                            {/* أزرار الرد */}
                            <div className="p-4 md:p-6 bg-slate-50/50 border-t border-slate-50 flex flex-col sm:flex-row gap-3">
                                <a
                                    href={`mailto:${selectedMsg.email}?subject=رد على استفسارك: ${selectedMsg.subject}`}
                                    className="flex-[2] bg-slate-900 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg"
                                >
                                    <Send size={18} /> الرد إيميل
                                </a>
                                <button
                                    onClick={() => window.open(`https://wa.me/?text=مرحباً ${selectedMsg.full_name}`, '_blank')}
                                    className="flex-1 bg-emerald-500 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg"
                                >
                                    <Smartphone size={18} /> واتساب
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-white/40 rounded-[32px] border-2 border-dashed border-slate-200 hidden lg:flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-200 mb-6 border border-slate-100">
                                <Mail size={40} />
                            </div>
                            <h3 className="text-slate-800 text-xl font-black mb-2">اختر رسالة للمراجعة</h3>
                            <p className="text-slate-400 text-sm font-bold max-w-sm">
                                سيتم عرض كافة التفاصيل هنا بمجرد اختيار الرسالة من القائمة الجانبية.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}