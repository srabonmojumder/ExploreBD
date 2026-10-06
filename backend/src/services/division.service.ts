import { divisionRepository } from '../repositories/division.repository.js';
import { ApiError } from '../utils/apiError.js';

export class DivisionService {
  async getAllDivisions() {
    return divisionRepository.findAll();
  }

  async getDivisionBySlug(slug: string) {
    const division = await divisionRepository.findBySlug(slug);
    if (!division) {
      throw ApiError.notFound(`Division '${slug}' not found`);
    }
    return division;
  }
}

export const divisionService = new DivisionService();
