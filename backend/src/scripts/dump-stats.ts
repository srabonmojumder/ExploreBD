import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const divisions = await prisma.division.findMany({
    include: {
      _count: {
        select: { districts: true, places: true },
      },
      districts: {
        include: {
          _count: {
            select: { places: true },
          },
        },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  const totalPlaces = await prisma.place.count();
  const totalDistricts = await prisma.district.count();
  const totalDivisions = await prisma.division.count();

  console.log('=== EXPLOREBD SYSTEM STATS ===');
  console.log(`Total Divisions: ${totalDivisions}`);
  console.log(`Total Districts: ${totalDistricts}`);
  console.log(`Total Tourist Spots: ${totalPlaces}\n`);

  for (const div of divisions) {
    console.log(`📍 ${div.bnName} (${div.name}) Division:`);
    console.log(`   - Districts: ${div._count.districts}`);
    console.log(`   - Total Spots: ${div._count.places}`);
    const districtSpots = div.districts.map(
      (d) => `${d.bnName || d.name} (${d._count.places})`
    );
    console.log(`   - District breakdown: ${districtSpots.join(', ')}\n`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
