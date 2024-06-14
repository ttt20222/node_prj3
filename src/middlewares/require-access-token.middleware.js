import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET_KEY } from '../constants/env.constant.js';
import { GetUserRepository } from '../repositories/users.repository.js';
import { HttpError } from '../errors/http.error.js';
import { prisma } from '../utils/prisma.util.js';

export default async function (req, res, next) {
  try {
    const getUserRepository = new GetUserRepository(prisma);

    const accesstoken = req.headers.authorization;

    if (!accesstoken) {
      throw new HttpError.Unauthorized('인증 정보가 없습니다.');
    }

    const [tokenType, token] = accesstoken.split(' ');

    if (tokenType !== 'Bearer') {
      throw new HttpError.Unauthorized('지원하지 않는 인증 방식입니다.');
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await getUserRepository.findUser(userId);

    if (!user) {
      throw new HttpError.Unauthorized('인증 정보와 일치하는 사용자가 없습니다.');
    }

    req.user = user;

    next();
    
  } catch (error) {
    next(error);
  }
}
