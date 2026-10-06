import { Router } from 'express';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

// Base health endpoint
apiRouter.use(healthRoutes);

// Scaffold structure for future phases
// apiRouter.use('/auth', authRoutes);
// apiRouter.use('/users', userRoutes);
// apiRouter.use('/divisions', divisionRoutes);
// apiRouter.use('/districts', districtRoutes);
// apiRouter.use('/places', placeRoutes);
// apiRouter.use('/visits', visitRoutes);
// apiRouter.use('/achievements', achievementRoutes);
// apiRouter.use('/leaderboard', leaderboardRoutes);
// apiRouter.use('/search', searchRoutes);

export default apiRouter;
