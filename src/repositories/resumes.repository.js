import { Prisma } from '@prisma/client';

export class ResumeRepository{
  constructor(prisma) {
    this.prisma = prisma;
  }

    createResumes = async (userId, title, content) => {
        const createResume = await this.prisma.resumes.create({
            data: {
                userId: +userId,
                title,
                content,
            },
        });

        return createResume;
    };

    findResumes = async (orderBy, filter) => {
        const resume = await this.prisma.resumes.findFirst({
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
    };

    findUserResume = async (filter) => {
        const resume = await this.prisma.resumes.findFirst({
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
        });

        return resume;
    };

    updateResumes = async (filter, title, content) => {
        const resume = await this.prisma.resumes.update({
            where: filter,
              data: {
                title: title || resume.title,
                content: content || resume.content,
              },
        });

        return resume;
    };

    deleteResumes = async (filter) => {
        const resume = await this.prisma.resumes.delete({
            where: filter,
              select: {
                resumeId: true,
              },
        });

        return resume;
    };

    updateStatus = async (userId, resumeId, status, reason) => {
        const [updatedResume, createdLog] = await this.prisma.$transaction(
            async (tx) => {
              const previousResume = await tx.resumes.findFirst({
                where: { resumeId: +resumeId },
                select: { status: true },
              });
    
              const updatedResume = await tx.resumes.update({
                where: { resumeId: +resumeId },
                data: {
                  status: status,
                },
              });
    
              const createdLog = await tx.resumes_log.create({
                data: {
                  recruiterId: userId,
                  resumeId: updatedResume.resumeId,
                  oldStatus: previousResume.status,
                  newStatus: updatedResume.status,
                  reason,
                },
              });
    
              return [updatedResume, createdLog];
            },
            {
              isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            }
          );

        return createdLog;
    };

    getResumeLog = async (resumeId) => {
        const resumesLog = await this.prisma.resumes_log.findMany({
            where: { resumeId: +resumeId },
            select: {
              logId: true,
              user: {
                select: {
                  name: true,
                },
              },
              resumeId: true,
              oldStatus: true,
              newStatus: true,
              reason: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        
        return resumesLog;
    };
}