import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("123456", 10); // الباسورد هيكون 123456

    const user = await prisma.user.upsert({
        where: { email: "admin@akhbarkom.com" },
        update: {},
        create: {
            email: "admin@akhbarkom.com",
            name: "مدير الموقع",
            password: hashedPassword,
            role: "admin",
        },
    });

    console.log("تم إنشاء المستخدم بنجاح:", user.email);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
