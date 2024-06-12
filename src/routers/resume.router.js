import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { Prisma } from '@prisma/client';
import authMiddleware from '../middlewares/require-access-token.middleware.js';
import { createResume, updateResumeJoi, updateStatus } from './joi.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';

const router = express.Router();

//이력서 생성 /resume
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, content } = req.body;

    await createResume.validateAsync(req.body);

    const resume = await prisma.resumes.create({
      data: {
        userId: +userId,
        title,
        content,
      },
    });

    const responseResume = {
      resumeId: resume.resumeId,
      userId: resume.userId,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };

    return res.status(201).json({
      staus: 201,
      message: '이력서 생성에 성공했습니다.',
      data: responseResume,
    });
  } catch (error) {
    next(error);
  }
});

//이력서 목록 조회 /resume?sort=desc
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const { sort, status } = req.query;
    const { userId } = req.user;

    const filter = {
      userId: +userId,
    };

    if (status) {
      filter.status = status;
    }

    const sortOrder = sort ? sort.toLowerCase() : 'desc';
    const orderBy = sortOrder === 'asc' ? 'asc' : 'desc';

    const user = await prisma.user.findFirst({
      where: { userId: +userId },
      select: { role: true },
    });

    if (user.role === 'RECRUITER') {
      delete filter.userId;
    }

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

    if (!resume) {
      return res.status(200).json({
        status: 200,
        message: '일치하는 값이 없습니다.',
        data: [],
      });
    }

    const transformedResume = resume.map((x) => ({
      resumeId: x.resumeId,
      name: x.user.name,
      title: x.title,
      content: x.content,
      status: x.status,
      createdAt: x.createdAt,
      updatedAt: x.updatedAt,
    }));

    return res.status(201).json({
      status: 201,
      message: '이력서 목록 조회에 성공했습니다.',
      data: transformedResume,
    });
  } catch (error) {
    next(error);
  }
});

//이력서 상세 조회 /resume/:resume_id
router.get('/:resume_id', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const params = req.params;
    const resumeId = params.resume_id;

    const user = await prisma.user.findFirst({
      where: { userId: +userId },
      select: { role: true },
    });

    if (user.role === 'RECRUITER') {
      const allResume = await prisma.resumes.findFirst({
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
        where: {
          resumeId: +resumeId,
        },
      });

      if (!allResume) {
        return res.status(400).json({
          status: 400,
          message: '이력서가 존재하지 않습니다.',
        });
      }

      const transformedResume = {
        resumeId: allResume.resumeId,
        name: allResume.user.name,
        title: allResume.title,
        content: allResume.content,
        status: allResume.status,
        createdAt: allResume.createdAt,
        updatedAt: allResume.updatedAt,
      };

      return res.status(201).json({
        status: 201,
        message: '이력서 상세 조회에 성공했습니다.',
        data: transformedResume,
      });
    }

    const resume = await prisma.resumes.findFirst({
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
      where: {
        resumeId: +resumeId,
        userId: +userId,
      },
    });

    if (!resume) {
      return res.status(400).json({
        status: 400,
        message: '이력서가 존재하지 않습니다.',
      });
    }

    const transformedResume = {
      resumeId: resume.resumeId,
      name: resume.user.name,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };

    return res.status(201).json({
      status: 201,
      message: '이력서 상세 조회에 성공했습니다.',
      data: transformedResume,
    });
  } catch (error) {
    next(error);
  }
});

//이력서 수정 /resume/:resume_id
router.patch('/:resume_id', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const params = req.params;
    const resumeId = params.resume_id;
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        status: 400,
        message: '수정 할 정보를 입력해 주세요.',
      });
    }

    await updateResumeJoi.validateAsync(req.body);

    const resume = await prisma.resumes.findFirst({
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        resumeId: +resumeId,
        userId: +userId,
      },
    });

    if (!resume) {
      return res.status(400).json({
        status: 400,
        message: '이력서가 존재하지 않습니다.',
      });
    }

    const updateResume = await prisma.resumes.update({
      where: {
        resumeId: +resumeId,
        userId: +userId,
      },
      data: {
        title: title || resume.title,
        content: content || resume.content,
      },
    });

    return res.status(200).json({
      status: 200,
      message: '이력서 수정에 성공했습니다.',
      data: updateResume,
    });
  } catch (error) {
    next(error);
  }
});

//이력서 삭제 /resume/:resume_id
router.delete('/:resume_id', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const params = req.params;
    const resumeId = params.resume_id;

    const resume = await prisma.resumes.findFirst({
      select: {
        resumeId: true,
        userId: true,
        title: true,
        content: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        resumeId: +resumeId,
        userId: +userId,
      },
    });

    if (!resume) {
      return res.status(400).json({
        status: 400,
        message: '이력서가 존재하지 않습니다.',
      });
    }

    const deleteResume = await prisma.resumes.delete({
      where: {
        resumeId: +resumeId,
        userId: +userId,
      },
      select: {
        resumeId: true,
      },
    });

    return res.status(201).json({
      status: 201,
      message: '이력서 삭제에 성공했습니다.',
      data: deleteResume.resumeId,
    });
  } catch (error) {
    next(error);
  }
});

//이력서 지원 상태 변경 /resume/:resume_id/status
router.patch(
  '/:resume_id/status',
  authMiddleware,
  requireRoles(['RECRUITER']),
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const params = req.params;
      const resumeId = params.resume_id;

      const { status, reason } = req.body;

      await updateStatus.validateAsync(req.body);

      const resume = await prisma.resumes.findFirst({
        where: { resumeId: +resumeId },
      });

      if (!resume) {
        return res.status(400).json({
          status: 400,
          message: '이력서가 존재하지 않습니다.',
        });
      }

      const [updatedResume, createdLog] = await prisma.$transaction(
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

      return res.status(201).json({
        status: 201,
        message: '이력서 지원 상태 변경에 성공했습니다.',
        data: createdLog,
      });
    } catch (error) {
      next(error);
    }
  }
);

//이력서 로그 목록 조회 /resume/:resume_id/log
router.get(
  '/:resume_id/log',
  authMiddleware,
  requireRoles(['RECRUITER']),
  async (req, res, next) => {
    try {
      const params = req.params;
      const resumeId = params.resume_id;

      const resumesLog = await prisma.resumes_log.findMany({
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

      if (!resumesLog) {
        return res.status(200).json({
          status: 200,
          data: [],
        });
      }

      const transformedResumesLog = resumesLog.map((log) => ({
        logId: log.logId,
        recruiterName: log.user.name,
        resumeId: log.resumeId,
        oldStatus: log.oldStatus,
        newStatus: log.newStatus,
        reason: log.reason,
        createdAt: log.createdAt,
      }));

      return res.status(201).json({
        status: 200,
        message: '이력서 로그 목록 조회에 성공했습니다.',
        data: transformedResumesLog,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
