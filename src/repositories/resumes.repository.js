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
}