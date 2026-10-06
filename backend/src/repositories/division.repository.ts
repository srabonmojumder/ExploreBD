import prisma from './prisma.js';

export class DivisionRepository {
  async findAll() {
    return prisma.division.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            districts: true,
            places: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.division.findUnique({
      where: { slug },
      include: {
        districts: {
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { places: true },
            },
          },
        },
        places: {
          take: 12,
          orderBy: { averageRating: 'desc' },
          include: {
            district: { select: { name: true, slug: true } },
          },
        },
        _count: {
          select: {
            districts: true,
            places: true,
          },
        },
      },
    });
  }
}

export const divisionRepository = new DivisionRepository();
