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
    }
}