import express from 'express';
import { registerUserController, loginUserController,
    getUsersController, changeUserBossController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/users', authMiddleware, getUsersController);
router.put('/users/:userId/change-boss', authMiddleware, changeUserBossController);

export default router;
