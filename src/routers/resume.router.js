import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { ResumeController } from '../controllers/resumes.controller.js';

const router = express.Router();

const resumeController = new ResumeController();

//이력서 생성 /resume
router.post('/', authMiddleware, resumeController.createResume);

//이력서 목록 조회 /resume?sort=desc
router.get('/', authMiddleware, resumeController.findResumes);

//이력서 상세 조회 /resume/:resume_id
router.get('/:resume_id', authMiddleware, resumeController.findUserResume);

//이력서 수정 /resume/:resume_id
router.patch('/:resume_id', authMiddleware, resumeController.updateResume);

//이력서 삭제 /resume/:resume_id
router.delete('/:resume_id', authMiddleware, resumeController.deleteResume);


//이력서 지원 상태 변경 /resume/:resume_id/status
router.patch('/:resume_id/status', authMiddleware, requireRoles(['RECRUITER']), resumeController.changeStatus);


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
