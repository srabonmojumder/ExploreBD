import { Router } from 'express';
import { divisionController } from '../controllers/division.controller.js';

const router = Router();

router.get('/', (req, res, next) => divisionController.getAllDivisions(req, res, next));
router.get('/:slug', (req, res, next) => divisionController.getDivisionBySlug(req, res, next));

export default router;
