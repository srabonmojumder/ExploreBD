import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(process.cwd(), 'backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log('🔄 Initiating ExploreBD Database Snapshot...');

  // 1. Fetch data from all active models
  const divisions = await prisma.division.findMany();
  const districts = await prisma.district.findMany();
  const places = await prisma.place.findMany();
  const placeImages = await prisma.placeImage.findMany();
  const users = await prisma.user.findMany();
  const visits = await prisma.visit.findMany();
  const reviews = await prisma.review.findMany();
  const achievements = await prisma.achievement.findMany();
  const userAchievements = await prisma.userAchievement.findMany();

  const backupData = {
    metadata: {
      appName: 'ExploreBD',
      version: '1.0.0',
      database: 'PostgreSQL',
      exportedAt: new Date().toISOString(),
      counts: {
        divisions: divisions.length,
        districts: districts.length,
        places: places.length,
        placeImages: placeImages.length,
        users: users.length,
        visits: visits.length,
        reviews: reviews.length,
        achievements: achievements.length,
        userAchievements: userAchievements.length,
      },
    },
    tables: {
      divisions,
      districts,
      places,
      placeImages,
      users,
      visits,
      reviews,
      achievements,
      userAchievements,
    },
  };

  // 2. Write JSON Backup
  const jsonFilename = `backup-explorebd-${timestamp}.json`;
  const jsonFilePath = path.join(backupDir, jsonFilename);
  fs.writeFileSync(jsonFilePath, JSON.stringify(backupData, null, 2), 'utf-8');

  // Also maintain a canonical 'latest.json' backup
  const latestJsonPath = path.join(backupDir, 'latest-backup.json');
  fs.writeFileSync(latestJsonPath, JSON.stringify(backupData, null, 2), 'utf-8');

  // 3. Write SQL Insert Backup
  const sqlFilename = `backup-explorebd-${timestamp}.sql`;
  const sqlFilePath = path.join(backupDir, sqlFilename);

  let sqlContent = `-- ExploreBD Database Backup Dump\n-- Generated At: ${new Date().toISOString()}\n\n`;

  // Helper to escape SQL strings
  const esc = (val: unknown) => {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (val instanceof Date) return `'${val.toISOString()}'`;
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  // Divisions
  if (divisions.length > 0) {
    sqlContent += `-- Table: divisions (${divisions.length} rows)\n`;
    for (const d of divisions) {
      sqlContent += `INSERT INTO "Division" ("id", "name", "bnName", "slug", "code", "description", "image", "createdAt", "updatedAt") VALUES (${esc(d.id)}, ${esc(d.name)}, ${esc(d.bnName)}, ${esc(d.slug)}, ${esc(d.code)}, ${esc(d.description)}, ${esc(d.image)}, ${esc(d.createdAt)}, ${esc(d.updatedAt)}) ON CONFLICT ("id") DO NOTHING;\n`;
    }
    sqlContent += '\n';
  }

  // Districts
  if (districts.length > 0) {
    sqlContent += `-- Table: districts (${districts.length} rows)\n`;
    for (const d of districts) {
      sqlContent += `INSERT INTO "District" ("id", "name", "bnName", "slug", "divisionId", "description", "coverImage", "latitude", "longitude", "createdAt", "updatedAt") VALUES (${esc(d.id)}, ${esc(d.name)}, ${esc(d.bnName)}, ${esc(d.slug)}, ${esc(d.divisionId)}, ${esc(d.description)}, ${esc(d.coverImage)}, ${esc(d.latitude)}, ${esc(d.longitude)}, ${esc(d.createdAt)}, ${esc(d.updatedAt)}) ON CONFLICT ("id") DO NOTHING;\n`;
    }
    sqlContent += '\n';
  }

  // Places
  if (places.length > 0) {
    sqlContent += `-- Table: places (${places.length} rows)\n`;
    for (const p of places) {
      sqlContent += `INSERT INTO "Place" ("id", "name", "bnName", "slug", "description", "districtId", "divisionId", "latitude", "longitude", "coverImage", "category", "averageRating", "totalVisitors", "createdAt", "updatedAt") VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.bnName)}, ${esc(p.slug)}, ${esc(p.description)}, ${esc(p.districtId)}, ${esc(p.divisionId)}, ${esc(p.latitude)}, ${esc(p.longitude)}, ${esc(p.coverImage)}, ${esc(p.category)}::"PlaceCategory", ${esc(p.averageRating)}, ${esc(p.totalVisitors)}, ${esc(p.createdAt)}, ${esc(p.updatedAt)}) ON CONFLICT ("id") DO NOTHING;\n`;
    }
    sqlContent += '\n';
  }

  // PlaceImages
  if (placeImages.length > 0) {
    sqlContent += `-- Table: place_images (${placeImages.length} rows)\n`;
    for (const pi of placeImages) {
      sqlContent += `INSERT INTO "PlaceImage" ("id", "placeId", "url", "caption", "createdAt") VALUES (${esc(pi.id)}, ${esc(pi.placeId)}, ${esc(pi.url)}, ${esc(pi.caption)}, ${esc(pi.createdAt)}) ON CONFLICT ("id") DO NOTHING;\n`;
    }
    sqlContent += '\n';
  }

  fs.writeFileSync(sqlFilePath, sqlContent, 'utf-8');

  // Also maintain a canonical 'latest.sql' backup
  const latestSqlPath = path.join(backupDir, 'latest-backup.sql');
  fs.writeFileSync(latestSqlPath, sqlContent, 'utf-8');

  console.log('✅ ExploreBD Database Backup Created Successfully!');
  console.log(`📁 JSON Backup: ${jsonFilePath}`);
  console.log(`📁 SQL Backup:  ${sqlFilePath}`);
  console.log(`📊 Statistics:
     - Divisions: ${divisions.length}
     - Districts: ${districts.length}
     - Places:    ${places.length}
     - Images:    ${placeImages.length}
     - Users:     ${users.length}
     - Visits:    ${visits.length}`);
}

createBackup()
  .catch((err) => {
    console.error('❌ Backup Failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
