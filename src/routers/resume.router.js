import express from 'express';
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
router.get('/:resume_id/log', authMiddleware, requireRoles(['RECRUITER']), resumeController.getResumeLog);

export default router;
