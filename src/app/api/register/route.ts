import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // 1. التأكد من إدخال البيانات
        if (!name || !email || !password) {
            return NextResponse.json({ message: "جميع الحقول مطلوبة" }, { status: 400 });
        }

        // 2. التأكد إن الإيميل مش موجود قبل كدة
        const userExists = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (userExists) {
            return NextResponse.json({ message: "هذا الإيميل مسجل بالفعل" }, { status: 400 });
        }

        // 3. تشفير الباسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. إنشاء المستخدم الجديد (بـ role مستخدم عادي تلقائياً)
        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: "user", // هنا بنحدد إنه مستخدم عادي مش أدمن
            },
        });

        return NextResponse.json({ message: "تم تسجيل الحساب بنجاح" }, { status: 201 });
    } catch (error) {
        console.error("REGISTER_ERROR:", error);
        return NextResponse.json({ message: "حدث خطأ أثناء التسجيل" }, { status: 500 });
    }
}
