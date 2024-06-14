export class GetUserRepository{
    constructor (prisma) {
        this.prisma = prisma;
    }

    findUser = async (userId) => {
        const getUser = await this.prisma.user.findFirst({
            where: { userId : +userId},
            select : {
                userId: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return getUser;
    };

    isExistUser = async (email) => {
        const findUser = await this.prisma.user.findFirst({
            where: {email},
        });

        return findUser;
    };

    createUser = async (email, hashPassword, name) => {
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashPassword,
                name,
            },
        });

        return user;
    };

    findToken = async (userId) => {
        const token = await this.prisma.tokens.findFirst({
            where: {userId: userId},
        });

        return token;
    };

    updateToken = async (userId, hashRefreshToken) => {
        await this.prisma.tokens.update({
            where: {userId: userId},
            data: { refreshToken: hashRefreshToken },
        });
    };

    createToken = async (userId, hashRefreshToken) => {
        await this.prisma.tokens.create({
            data: {
                userId : userId,
                refreshToken: hashRefreshToken,
            },
        });
    };

    updateToken = async (userId, hashRefreshToken) => {
        await this.prisma.tokens.update({
            where: {
              userId: +userId,
            },
            data: {
              refreshToken: hashRefreshToken,
            },
          });
    };

    logOutUser = async (userId) => {
        await this.prisma.tokens.delete({
            where: { userId: +userId },
        });
    }
}