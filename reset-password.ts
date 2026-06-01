import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('admin123!', 12);
    const demoPassword = await bcrypt.hash('demo1234', 12);

    await prisma.user.upsert({
        where: { email: 'admin@khmervoiceai.com' },
        update: { passwordHash: adminPassword },
        create: {
            name: 'Admin',
            email: 'admin@khmervoiceai.com',
            passwordHash: adminPassword,
            role: 'admin',
            subscriptionPlan: 'ENTERPRISE',
            charactersLimit: 999999999,
        },
    });

    await prisma.user.upsert({
        where: { email: 'demo@khmervoiceai.com' },
        update: { passwordHash: demoPassword },
        create: {
            name: 'Demo User',
            email: 'demo@khmervoiceai.com',
            passwordHash: demoPassword,
            subscriptionPlan: 'PRO',
            charactersLimit: 500000,
        },
    });

    console.log('✅ Passwords reset!');
    await prisma.$disconnect();
}

main();