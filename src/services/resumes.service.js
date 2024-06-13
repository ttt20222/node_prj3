import { ResumeRepository } from '../repositories/resumes.repository.js';

export class ResumeService{
    resumeRepository = new ResumeRepository();

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
    
}