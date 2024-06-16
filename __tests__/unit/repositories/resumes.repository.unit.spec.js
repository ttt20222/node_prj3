import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { ResumeRepository } from '../../../src/repositories/resumes.repository.js';

const mockPrisma = {
  resumes: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const resumeRepository = new ResumeRepository(mockPrisma);

describe('ResumeRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });

  test('create Method', async () => {
    // GIVEN
    // WHEN
    // THEN
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
