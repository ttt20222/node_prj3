import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import refreshMiddleware from '../middlewares/require-refresh-token.middleware.js';

const router = express.Router();

const authController = new AuthController();

//회원가입 /auth/sign-up
router.post('/sign-up', authController.signUp);

//로그인 /auth/sign-in
router.post('/sign-in', authController.signIn);

//토큰 재발급 /auth/tokens
router.post('/tokens', refreshMiddleware, authController.updateRefreshToken);
  
//로그아웃 /auth/sign-out
router.delete('/sign-out', refreshMiddleware, async (req, res, next) => {
const { userId } = req.user;

await prisma.tokens.delete({
    where: { userId: +userId },
});

return res.status(200).json({
    status: 200,
    message: '로그아웃에 성공했습니다.',
    data: {
    id: userId,
    },
});
});

export default router;
