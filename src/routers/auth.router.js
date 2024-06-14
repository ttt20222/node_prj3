import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import refreshMiddleware from '../middlewares/require-refresh-token.middleware.js';
import { prisma } from '../utils/prisma.util.js';
import { AuthService } from '../services/auth.service.js';
import { GetUserRepository } from '../repositories/users.repository.js';

const router = express.Router();

const getUserRepository = new GetUserRepository(prisma);
const authService = new AuthService(getUserRepository);
const authController = new AuthController(authService);

//회원가입 /auth/sign-up
router.post('/sign-up', authController.signUp);

//로그인 /auth/sign-in
router.post('/sign-in', authController.signIn);

//토큰 재발급 /auth/tokens
router.post('/tokens', refreshMiddleware, authController.updateRefreshToken);
  
//로그아웃 /auth/sign-out
router.delete('/sign-out', refreshMiddleware, authController.logOutUser);

export default router;
