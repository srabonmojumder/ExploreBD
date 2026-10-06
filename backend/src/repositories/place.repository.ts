import prisma from './prisma.js';
import { PlaceCategory, Prisma } from '@prisma/client';

export interface PlaceFilterParams {
  category?: PlaceCategory;
  districtSlug?: string;
  divisionSlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'popular' | 'newest';
}

export class PlaceRepository {
  async findAll(params: PlaceFilterParams) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 12));
    const skip = (page - 1) * limit;

    const where: Prisma.PlaceWhereInput = {};

    if (params.category) {
      where.category = params.category;
    }

    if (params.districtSlug) {
      where.district = { slug: params.districtSlug };
    }

    if (params.divisionSlug) {
      where.division = { slug: params.divisionSlug };
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { bnName: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.PlaceOrderByWithRelationInput = { averageRating: 'desc' };
    if (params.sortBy === 'popular') {
      orderBy = { totalVisitors: 'desc' };
    } else if (params.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const [items, total] = await Promise.all([
      prisma.place.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          district: { select: { name: true, bnName: true, slug: true } },
          division: { select: { name: true, bnName: true, slug: true } },
          images: { take: 1, select: { url: true, caption: true } },
          _count: { select: { visits: true, reviews: true } },
        },
      }),
      prisma.place.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    return prisma.place.findUnique({
      where: { slug },
      include: {
        district: {
          select: {
            id: true,
            name: true,
            bnName: true,
            slug: true,
            description: true,
            coverImage: true,
          },
        },
        division: {
          select: {
            id: true,
            name: true,
            bnName: true,
            slug: true,
            code: true,
          },
        },
        images: {
          orderBy: { createdAt: 'asc' },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            visits: true,
            reviews: true,
          },
        },
      },
    });
  }

  async findRecommended(category: PlaceCategory, currentSlug: string, limit = 4) {
    return prisma.place.findMany({
      where: {
        category,
        slug: { not: currentSlug },
      },
      take: limit,
      orderBy: { averageRating: 'desc' },
      include: {
        district: { select: { name: true, slug: true } },
        images: { take: 1 },
      },
    });
  }
}

export const placeRepository = new PlaceRepository();
