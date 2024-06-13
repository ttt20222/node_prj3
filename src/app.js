import express from 'express';
import cookieParser from 'cookie-parser';
import AuthRouter from './routers/auth.router.js';
import userRouter from './routers/user.router.js';
import resumeRouter from './routers/resume.router.js';
import ErrorHandlerMiddleware from './middlewares/error-handler.middleware.js';
import { SERVER_PORT } from './constants/env.constant.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', AuthRouter);
app.use('/users', userRouter);
app.use('/resume', resumeRouter);

app.use(ErrorHandlerMiddleware);

app.listen(SERVER_PORT, () => {
  console.log(SERVER_PORT, '포트로 서버가 열렸어요!');
});
