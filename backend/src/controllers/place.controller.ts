import { Request, Response, NextFunction } from 'express';
import { placeService } from '../services/place.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { PlaceCategory } from '@prisma/client';

export class PlaceController {
  async getPlaces(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, district, division, search, page, limit, sortBy } = req.query;

      const results = await placeService.getPlaces({
        category: category ? (category as PlaceCategory) : undefined,
        districtSlug: typeof district === 'string' ? district : undefined,
        divisionSlug: typeof division === 'string' ? division : undefined,
        search: typeof search === 'string' ? search : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as 'rating' | 'popular' | 'newest',
      });

      return ApiResponse.success(res, results.items, 200, undefined);
    } catch (error) {
      next(error);
    }
  }

  async getPlaceBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const place = await placeService.getPlaceBySlug(slug);
      return ApiResponse.success(res, place);
    } catch (error) {
      next(error);
    }
  }
}

export const placeController = new PlaceController();
