import { GetUserRepository } from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService{
    createUserRepository = new GetUserRepository();

    createUser = async (email, password, passwordConfirm, name) => {
        const isExistUser = await this.createUserRepository.isExistUser(email);

        if (isExistUser) {
            return res.status(400).json({message: '이미 가입된 사용자입니다.'});
        };

        if (password != passwordConfirm) {
            return res.status(400).json({message: '입력한 두 비밀번호가 일치하지 않습니다.'});
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
    }
}