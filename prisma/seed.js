import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const user = await prisma.user.upsert({
        where: { email: "admin@akhbarkom.com" },
        update: {
            password: hashedPassword, // بنأكد تحديث الباسورد لو اليوزر موجود
        },
        create: {
            email: "admin@akhbarkom.com",
            name: "مدير الموقع",
            password: hashedPassword,
            role: "admin",
        },
    });

    console.log("✅ تم إنشاء/تحديث المستخدم بنجاح: admin@akhbarkom.com");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
