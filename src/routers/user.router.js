import express from 'express';
import authMiddleware from '../middlewares/require-access-token.middleware.js';
import { GetUserController } from '../controllers/users.controller.js';

const router = express.Router();

//컨트롤러 인스턴스 생성
const getUserController = new GetUserController();

//내 정보 조회 /users
router.get('/', authMiddleware, getUserController.getUser);

// router.get('/', authMiddleware, async (req, res, next) => {
//   try {
//     const { userId } = req.user;

//     const user = await prisma.user.findFirst({
//       where: { userId: +userId },
//       select: {
//         userId: true,
//         email: true,
//         name: true,
//         role: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return res.status(201).json({
//       status: 201,
//       message: '내 정보 조회에 성공했습니다.',
//       data: user,
//     });
//   } catch (error) {
//     next(error);
//   }
// });

export default router;
