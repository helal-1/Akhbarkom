import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // استخراج التوكن (الجلسة)
        const token = req.nextauth.token;

        // التحقق من صلاحية الأدمن
        const isAdmin = token?.role === "ADMIN";

        // إذا كان يحاول دخول صفحات الإدارة وهو ليس أدمن، حوله للرئيسية
        if (req.nextUrl.pathname.startsWith("/dashboard") && !isAdmin) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            // الدالة دي بتحدد هل المستخدم مسموح له يكمل للميدل وير ولا يروح للوجن الأول
            authorized: ({ token }) => !!token,
        },
    },
);

// تحديد المسارات التي سيتم تطبيق الميدل وير عليها
export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
