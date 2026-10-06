import prisma from './prisma.js';
import { Prisma } from '@prisma/client';

export class DistrictRepository {
  async findAll(params: { divisionSlug?: string; search?: string }) {
    const where: Prisma.DistrictWhereInput = {};

    if (params.divisionSlug) {
      where.division = { slug: params.divisionSlug };
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { bnName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.district.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        division: {
          select: { name: true, bnName: true, slug: true },
        },
        _count: {
          select: { places: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.district.findUnique({
      where: { slug },
      include: {
        division: {
          select: { id: true, name: true, bnName: true, slug: true, description: true },
        },
        places: {
          orderBy: { averageRating: 'desc' },
          include: {
            images: { take: 1 },
            _count: { select: { visits: true, reviews: true } },
          },
        },
        _count: {
          select: { places: true },
        },
      },
    });
  }
}

export const districtRepository = new DistrictRepository();
