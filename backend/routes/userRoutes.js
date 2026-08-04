import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUsers)
  .post(authorize('Manager'), createUser);

router.route('/:id')
  .put(authorize('Manager'), updateUser)
  .delete(authorize('Manager'), deleteUser);

export default router;
