import { Router } from 'express';
import { placeController } from '../controllers/place.controller.js';

const router = Router();

router.get('/', (req, res, next) => placeController.getPlaces(req, res, next));
router.get('/:slug', (req, res, next) => placeController.getPlaceBySlug(req, res, next));

export default router;
