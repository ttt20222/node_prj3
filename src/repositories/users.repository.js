import { prisma } from "../utils/prisma.util.js";

export class GetUserRepository{
    findUser = async (userId) => {
        const getUser = await prisma.user.findFirst({
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
        const findUser = await prisma.user.findFirst({
            where: {email},
        });

        return findUser;
    };

    createUser = async (email, hashPassword, name) => {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                name,
            },
        });

        return user;
    };

    findToken = async (userId) => {
        const token = await prisma.tokens.findFirst({
            where: {userId: userId},
        });

        return token;
    };

    updateToken = async (userId, hashRefreshToken) => {
        await prisma.tokens.update({
            where: {userId: userId},
            data: { refreshToken: hashRefreshToken },
        });
    };

    createToken = async (userId, hashRefreshToken) => {
        await prisma.tokens.create({
            data: {
                userId : userId,
                refreshToken: hashRefreshToken,
            },
        });
    };

    updateToken = async (userId, hashRefreshToken) => {
        await prisma.tokens.update({
            where: {
              userId: +userId,
            },
            data: {
              refreshToken: hashRefreshToken,
            },
          });
    }
}