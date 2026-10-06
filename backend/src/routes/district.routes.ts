import { Router } from 'express';
import { districtController } from '../controllers/district.controller.js';

const router = Router();

router.get('/', (req, res, next) => districtController.getAllDistricts(req, res, next));
router.get('/:slug', (req, res, next) => districtController.getDistrictBySlug(req, res, next));

export default router;
