import { GetUserRepository } from '../repositories/users.repository.js';
import { HttpError } from '../errors/http.error.js';

export const requireRoles = (roles) => async (req, res, next) => {
  try {
    const getUserRepository = new GetUserRepository();
    const { userId } = req.user;

    const user = await getUserRepository.findUser(userId);
    // const user = await prisma.user.findFirst({
    //   where: { userId: +userId },
    //   select: { role: true },
    // });

    if (!user || !roles.includes(user.role)) {
      throw new HttpError.Forbidden('접근 권한이 없습니다.');
    }

    next();
  } catch (error) {
    next(error);
  }
};
