import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { REFRESH_TOKEN_SECRET_KEY } from '../constants/env.constant.js';
import { GetUserRepository } from '../repositories/users.repository.js';
import { HttpError } from '../errors/http.error.js';

export default async function (req, res, next) {
  try {
    const getUserRepository = new GetUserRepository();

    const refreshtoken = req.headers.authorization;

    if (!refreshtoken) {
      throw new HttpError.Unauthorized('인증 정보가 없습니다.');
    }

    const [tokenType, token] = refreshtoken.split(' ');

    if (tokenType !== 'Bearer') {
      throw new HttpError.Unauthorized('지원하지 않는 인증 방식입니다.');
    }

    const decodedToken = jwt.verify(
      token,
      REFRESH_TOKEN_SECRET_KEY
    );
    const userId = decodedToken.userId;

    const user = await getUserRepository.findUser(userId);

    if (!user) {
      throw new HttpError.Unauthorized('인증 정보와 일치하는 사용자가 없습니다.');
    }

    const tokens = await getUserRepository.findToken(userId);

    if (!tokens || !(await bcrypt.compare(token, tokens.refreshToken))) {
      throw new HttpError.Unauthorized('폐기된 인증 정보입니다.');
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
