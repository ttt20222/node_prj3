import { AuthService } from '../services/auth.service.js';
import { createUser, loginUser } from '../routers/joi.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';

export class AuthController{

    authService = new AuthService();
    
    //회원가입
    signUp = async (req, res, next) => {
        try{
            const { email, password, passwordConfirm, name } = req.body;

            await createUser.validateAsync(req.body);

            const createUsers = await this.authService.createUser(email, password, passwordConfirm, name);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: '회원가입에 성공했습니다.',
                data: createUsers});

        } catch(error){
            next(error);
        }
    };

    //로그인
    signIn = async (req, res, next) => {
        try{
            const { email, password } = req.body;

            await loginUser.validateAsync(req.body);

            const user = await this.authService.loginUser(email, password);

            res.setHeader('accesstoken', `Bearer ${user.accesstoken}`);
            res.setHeader('refreshtoken', `Bearer ${user.refreshtoken}`);

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: '로그인에 성공했습니다.',
                data: user});
        } catch(error){
            next(error);
        }
    };

    updateRefreshToken = async (req, res, next) => {
        try {
            const { userId } = req.user;

            const token = await this.authService.updateRefreshToken(userId);

            res.setHeader('accesstoken', `Bearer ${token.accesstoken}`);
            res.setHeader('refreshtoken', `Bearer ${token.refreshtoken}`);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: '토큰 재발급에 성공했습니다.',
                data: token});

        }catch(error){
            next(error);
        }
    };

    logOutUser = async (req, res, next) => {
        try {
            const { userId } = req.user;

            await this.authService.logOutUser(userId);

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: '로그아웃에 성공했습니다.',
                userId: userId});

        }catch(error){
            next(error);
        }
    };
};