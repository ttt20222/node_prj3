import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { ResumeRepository } from '../../../src/repositories/resumes.repository.js';
import { dummyResumes } from '../../dummies/resumes.dummy.js';

const mockPrisma = {
  resumes: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const resumeRepository = new ResumeRepository(mockPrisma);

describe('ResumeRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });

  test('createResumes Method', async () => {
    // GIVEN
    const { userId, title, content } = dummyResumes[0];
    const mockReturn = {
    userId,
    title,
    content,
    status: 'APPLICANT',
    createdAt: new Date(),
    updatedAt: new Date(),
    };
    mockPrisma.resumes.create.mockReturnValue(mockReturn);

    // WHEN
    const actualResult = await resumeRepository.createResumes(userId,title,content);

    // THEN
    const expectedResult = mockReturn;

    expect(mockPrisma.resumes.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumes.create).toHaveBeenCalledWith({
    data: {
        userId,
        title,
        content,
    },
    });
    expect(actualResult).toEqual(expectedResult);
  });

  test('readMany Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('readOne Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('update Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });

  test('delete Method', async () => {
    // GIVEN
    // WHEN
    // THEN
  });
});
