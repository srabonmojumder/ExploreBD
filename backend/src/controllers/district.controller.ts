import { Request, Response, NextFunction } from 'express';
import { districtService } from '../services/district.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class DistrictController {
  async getAllDistricts(req: Request, res: Response, next: NextFunction) {
    try {
      const { division, search } = req.query;
      const districts = await districtService.getAllDistricts({
        divisionSlug: typeof division === 'string' ? division : undefined,
        search: typeof search === 'string' ? search : undefined,
      });
      return ApiResponse.success(res, districts);
    } catch (error) {
      next(error);
    }
  }

  async getDistrictBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const district = await districtService.getDistrictBySlug(slug);
      return ApiResponse.success(res, district);
    } catch (error) {
      next(error);
    }
  }
}

export const districtController = new DistrictController();
