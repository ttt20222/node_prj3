import express from 'express';
import authMiddleware from '../middlewares/require-access-token.middleware.js';
import { GetUserController } from '../controllers/users.controller.js';

const router = express.Router();

//컨트롤러 인스턴스 생성
const getUserController = new GetUserController();

//내 정보 조회 /users
router.get('/', authMiddleware, getUserController.getUser);

export default router;
