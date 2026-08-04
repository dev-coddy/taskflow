import express from 'express';
import { getDashboardStats, generateEODEmailReport } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.post('/generate-email', authorize('Manager'), generateEODEmailReport);

export default router;
