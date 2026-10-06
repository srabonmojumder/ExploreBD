import { placeRepository, PlaceFilterParams } from '../repositories/place.repository.js';
import { ApiError } from '../utils/apiError.js';

export class PlaceService {
  async getPlaces(params: PlaceFilterParams) {
    return placeRepository.findAll(params);
  }

  async getPlaceBySlug(slug: string) {
    const place = await placeRepository.findBySlug(slug);
    if (!place) {
      throw ApiError.notFound(`Tourist place '${slug}' not found`);
    }

    const recommended = await placeRepository.findRecommended(
      place.category,
      place.slug,
      4
    );

    return {
      ...place,
      recommended,
    };
  }
}

export const placeService = new PlaceService();
