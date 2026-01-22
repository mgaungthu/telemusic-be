import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // =========================
  // Seed Genres
  // =========================
  await prisma.genre.createMany({
    data: [
      { name: 'Pop' },
      { name: 'Hip Hop' },
      { name: 'Rock' },
      { name: 'Electronic' },
      { name: 'Jazz' },
      { name: 'R&B' },
      { name: 'Classical' },
    ],
    skipDuplicates: true,
  });

  // =========================
  // Seed Countries
  // =========================
  await prisma.country.createMany({
    data: [
      { name: 'Myanmar', code: 'MM' },
      { name: 'Thailand', code: 'TH' },
      { name: 'United States', code: 'US' },
    ],
    skipDuplicates: true,
  });

  // =========================
  // Seed Cities (by Country)
  // =========================
  const myanmar = await prisma.country.findUnique({
    where: { code: 'MM' },
  });

  const thailand = await prisma.country.findUnique({
    where: { code: 'TH' },
  });

  const usa = await prisma.country.findUnique({
    where: { code: 'US' },
  });

  if (myanmar) {
    await prisma.city.createMany({
      data: [
        { name: 'Yangon', countryId: myanmar.id },
        { name: 'Mandalay', countryId: myanmar.id },
        { name: 'Naypyidaw', countryId: myanmar.id },
      ],
      skipDuplicates: true,
    });
  }

  if (thailand) {
    await prisma.city.createMany({
      data: [
        { name: 'Bangkok', countryId: thailand.id },
        { name: 'Chiang Mai', countryId: thailand.id },
      ],
      skipDuplicates: true,
    });
  }

  if (usa) {
    await prisma.city.createMany({
      data: [
        { name: 'New York', countryId: usa.id },
        { name: 'Los Angeles', countryId: usa.id },
      ],
      skipDuplicates: true,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });