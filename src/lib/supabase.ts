import { createClient } from "@supabase/supabase-js";

// نستخدم السلسلة النصية الفارغة كبديل مؤقت لمنع الـ Build من الانهيار
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// هذا التحذير سيظهر لك في الـ Logs فقط للتأكد
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Supabase keys are missing during build time.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
