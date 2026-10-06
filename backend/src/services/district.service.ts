import { districtRepository } from '../repositories/district.repository.js';
import { ApiError } from '../utils/apiError.js';

export class DistrictService {
  async getAllDistricts(filters: { divisionSlug?: string; search?: string }) {
    return districtRepository.findAll(filters);
  }

  async getDistrictBySlug(slug: string) {
    const district = await districtRepository.findBySlug(slug);
    if (!district) {
      throw ApiError.notFound(`District '${slug}' not found`);
    }

    // Calculate initial statistics (total places, user exploration stats structure)
    const totalPlaces = district.places.length;
    const popularPlaces = district.places.slice(0, 4);

    return {
      ...district,
      stats: {
        totalPlaces,
        exploredPlaces: 0,
        explorationPercentage: 0,
      },
      popularPlaces,
    };
  }
}

export const districtService = new DistrictService();
