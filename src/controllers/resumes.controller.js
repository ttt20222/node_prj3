import { ResumeService } from '../services/resumes.service.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { createResume, updateResumeJoi, updateStatus } from '../routers/joi.js';

export class ResumeController{

    resumeService = new ResumeService();

    createResume = async (req, res, next) => {
        try{
            const { userId } = req.user;
            const { title, content } = req.body;

            console.log(userId);

            await createResume.validateAsync(req.body);

            const Resume = await this.resumeService.createResume(userId, title, content);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: '이력서 생성에 성공했습니다.',
                data: Resume,
            });

        }catch(error){
            next(error);
        }
    };

    findResumes = async (req, res, next) => {
        try{
            const { sort, status } = req.query;
            const { userId } = req.user;

            const resumes = await this.resumeService.findResume(userId, sort, status);

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: '이력서 목록 조회에 성공했습니다.',
                data: resumes});

        }catch(error){
            next(error);
        }
    };

    findUserResume = async (req, res, next) => {
        try{
            const { userId } = req.user;
            const params = req.params;
            const resumeId = params.resume_id;

            const resume = await this.resumeService.findUserResumes(userId, resumeId);

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                message: '이력서 상세 조회에 성공했습니다.',
                data: resume});

        }catch(error){
            next(error);
        }
    };

    updateResume = async (req, res, next) => {
        try{
            const { userId } = req.user;
            const params = req.params;
            const resumeId = params.resume_id;
            const { title, content } = req.body;

            await updateResumeJoi.validateAsync(req.body);

            const resume = await this.resumeService.updateResumes(userId, resumeId, title, content);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: '이력서 수정에 성공했습니다.',
                data: resume});

        }catch(error){
            next(error);
        }
    };

    deleteResume = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const params = req.params;
            const resumeId = params.resume_id;

            const resume = await this.resumeService.deleteResumes(userId, resumeId);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: '이력서 삭제에 성공했습니다.',
                data: resume});

        }catch(error){
            next(error);
        }
    };

    changeStatus = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const params = req.params;
            const resumeId = params.resume_id;
            const { status, reason } = req.body;

            await updateStatus.validateAsync(req.body);

            const resume = await this.resumeService.updateStatus(userId, resumeId, status, reason);

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                message: '이력서 지원 상태 변경에 성공했습니다.',
                data: resume});

        }catch(error){
            next(error);
        }
    };
}