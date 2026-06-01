import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    await prisma.voice.updateMany({ where: { name: 'james' }, data: { providerId: 'TxGEqnHWrfWFTfGW9XjX' } });
    await prisma.voice.updateMany({ where: { name: 'sophia' }, data: { providerId: 'EXAVITQu4vr4xnSDxMaL' } });
    await prisma.voice.updateMany({ where: { name: 'alex' }, data: { providerId: 'VR6AewLTigWG4xSOukaG' } });
    await prisma.voice.updateMany({ where: { name: 'maya' }, data: { providerId: 'pNInz6obpgDQGcFmaJgB' } });
    console.log('✅ Voice IDs updated!');
    await prisma.$disconnect();
}
main();