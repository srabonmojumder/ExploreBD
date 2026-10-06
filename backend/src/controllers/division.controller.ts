import { Request, Response, NextFunction } from 'express';
import { divisionService } from '../services/division.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class DivisionController {
  async getAllDivisions(_req: Request, res: Response, next: NextFunction) {
    try {
      const divisions = await divisionService.getAllDivisions();
      return ApiResponse.success(res, divisions);
    } catch (error) {
      next(error);
    }
  }

  async getDivisionBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const division = await divisionService.getDivisionBySlug(slug);
      return ApiResponse.success(res, division);
    } catch (error) {
      next(error);
    }
  }
}

export const divisionController = new DivisionController();
