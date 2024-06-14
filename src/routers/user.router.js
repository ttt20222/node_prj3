import express from 'express';
import authMiddleware from '../middlewares/require-access-token.middleware.js';
import { GetUserController } from '../controllers/users.controller.js';
import { prisma } from '../utils/prisma.util.js';
import { GetUserRepository } from '../repositories/users.repository.js';
import { GetUserService } from '../services/user.service.js';

const router = express.Router();

//컨트롤러 인스턴스 생성
const getUserRepository = new GetUserRepository(prisma);
const getUserService = new GetUserService(getUserRepository);
const getUserController = new GetUserController(getUserService);

//내 정보 조회 /users
router.get('/', authMiddleware, getUserController.getUser);

export default router;
