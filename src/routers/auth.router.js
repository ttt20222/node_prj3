import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';

const router = express.Router();

const authController = new AuthController();

//회원가입 /auth/sign-up
router.post('/sign-up', authController.signUp);

//로그인 /auth/sign-in
router.post('/sign-in', authController.signIn);

export default router;
