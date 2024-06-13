import { AuthService } from '../services/auth.service.js';
import { createUser, loginUser } from '../routers/joi.js';

export class AuthController{

    authService = new AuthService();
    
    //회원가입
    signUp = async (req, res, next) => {
        try{
            const { email, password, passwordConfirm, name } = req.body;

            await createUser.validateAsync(req.body);

            const createUsers = await this.authService.createUser(email, password, passwordConfirm, name);

            return res.status(200).json({data:createUsers});

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

            return res.status(200).json({data:user});
        } catch(error){
            next(error);
        }
    };
};