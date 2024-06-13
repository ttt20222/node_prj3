import { ResumeRepository } from '../repositories/resumes.repository.js';
import { GetUserRepository } from '../repositories/users.repository.js';
import { HttpError } from '../errors/http.error.js';

export class ResumeService{
    resumeRepository = new ResumeRepository();
    getUserRepository = new GetUserRepository();

    createResume = async (userId, title, content) => {
        
        const resume = await this.resumeRepository.createResumes(userId, title, content);

        return {
            resumeId: resume.resumeId,
            userId: resume.userId,
            title: resume.title,
            content: resume.content,
            status: resume.status,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        };
    };

    findResume = async (userId, sort, status) => {

        const filter = {userId: +userId,};

        if (status) {
            filter.status = status;
        };

        const sortOrder = sort ? sort.toLowerCase() : 'desc';
        const orderBy = sortOrder === 'asc' ? 'asc' : 'desc';

        const user = await this.getUserRepository.findUser(userId);

        if (user.role === 'RECRUITER') {
            delete filter.userId;
            };

        const resume = await this.resumeRepository.findResumes(orderBy, filter);

        if (!resume) {
            throw new HttpError.NotFound('일치하는 값이 없습니다.');
        };

        const transformedResume = resume.map((x) => ({
            resumeId: x.resumeId,
            name: x.user.name,
            title: x.title,
            content: x.content,
            status: x.status,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
          }));

        return transformedResume;
    };

    findUserResumes = async (userId, resumeId) => {
        const user = await this.getUserRepository.findUser(userId);

        const filter = {
            userId: +userId,
            resumeId: +resumeId,};

        if (user.role === 'RECRUITER') {
            delete filter.userId;
            const resume = await this.resumeRepository.findUserResume(filter);
            
            if (!resume) {
                throw new HttpError.NotFound('이력서가 존재하지 않습니다.');
            };
    
            const transformedResume = {
                resumeId: resume.resumeId,
                name: resume.user.name,
                title: resume.title,
                content: resume.content,
                status: resume.status,
                createdAt: resume.createdAt,
                updatedAt: resume.updatedAt,
            };
    
            return transformedResume;
        };

        const resume = await this.resumeRepository.findUserResume(filter);

        if (!resume) {
            throw new HttpError.NotFound('이력서가 존재하지 않습니다.');
        };

        const transformedResume = {
            resumeId: resume.resumeId,
            name: resume.user.name,
            title: resume.title,
            content: resume.content,
            status: resume.status,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        };

        return transformedResume;
    }
}