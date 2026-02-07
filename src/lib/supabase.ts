import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ملاحظة: علامة (!) في نهاية المتغير تخبر TypeScript:
// "أنا أضمن لك أن هذا المتغير موجود وليس undefined"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
