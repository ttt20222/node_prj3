import { prisma } from "../utils/prisma.util.js";

export class ResumeRepository{
    createResumes = async (userId, title, content) => {
        const createResume = await prisma.resumes.create({
            data: {
                userId: +userId,
                title,
                content,
            },
        });

        return createResume;
    };

    findResumes = async (orderBy, filter) => {
        const resume = await prisma.resumes.findMany({
            select: {
                resumeId: true,
                user: {
                  select: {
                    name: true,
                  },
                },
                title: true,
                content: true,
                status: true,
                createdAt: true,
                updatedAt: true,
              },
              where: filter,
              orderBy: {
                createdAt: orderBy,
              },
        });

        return resume;
    }
}