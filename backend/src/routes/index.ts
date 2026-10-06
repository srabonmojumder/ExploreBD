import { Router } from 'express';
import healthRoutes from './health.routes.js';
import divisionRoutes from './division.routes.js';
import districtRoutes from './district.routes.js';
import placeRoutes from './place.routes.js';

const apiRouter = Router();

// Base health endpoint
apiRouter.use(healthRoutes);

// Core Data endpoints
apiRouter.use('/divisions', divisionRoutes);
apiRouter.use('/districts', districtRoutes);
apiRouter.use('/places', placeRoutes);

export default apiRouter;
