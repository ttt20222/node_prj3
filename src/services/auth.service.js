import { GetUserRepository } from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from '../constants/env.constant.js';

export class AuthService{
    createUserRepository = new GetUserRepository();

    createUser = async (email, password, passwordConfirm, name) => {
        const isExistUser = await this.createUserRepository.isExistUser(email);

        if (isExistUser) {
            throw new Error('이미 가입된 사용자입니다.');
        };

        if (password != passwordConfirm) {
            throw new Error('입력한 두 비밀번호가 일치하지 않습니다.');
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await this.createUserRepository.createUser(email, hashPassword, name);

        return {
            userId: user.userId,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    };

    loginUser = async (email, password) => {
        const user = await this.createUserRepository.isExistUser(email);

        if(!user) {
            throw new Error('인증 정보와 일치하는 사용자가 없습니다.');
        } else if (!(await bcrypt.compare(password, user.password))) {
            throw new Error('비밀번호가 일치하지 않습니다.');
        };

        const accesstoken = jwt.sign(
            { userId: user.userId },
            ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: '12h' }
          );

          const refreshtoken = jwt.sign(
            { userId: user.userId },
            REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: '7d' }
          );

          const hashRefreshToken = await bcrypt.hash(refreshtoken, 10);

          const existingToken = await this.createUserRepository.findToken(user.userId);

          if (existingToken) {
            const updateUser = await this.createUserRepository.updateToken(user.userId, hashRefreshToken);

            return {
                userId: user.userId,
                accesstoken: accesstoken,
                refreshtoken: refreshtoken,
            };
          };

          await this.createUserRepository.createToken(user.userId, hashRefreshToken);
          return {
            userId: user.userId,
            accesstoken: accesstoken,
            refreshtoken: refreshtoken,
            };
    };
}