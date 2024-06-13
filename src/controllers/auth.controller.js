import { AuthService } from '../services/auth.service.js';
import bcrypt from 'bcrypt';
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

        } catch(error){
            next(error);
        }
    };
};