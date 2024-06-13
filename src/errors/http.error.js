import { HTTP_STATUS } from '../constants/http-status.constant.js';

class BadRequest { // 사용자가 잘못 했을 때 (예: 입력 값을 빠뜨렸을 때)
  constructor(message = BadRequest.name) {
    this.message = message;
    this.status = HTTP_STATUS.BAD_REQUEST;
  }
}

class Unauthorized { // 인증 실패 unauthenciated (예: 비밀번호가 틀렸을 때)
  constructor(message = Unauthorized.name) {
    this.message = message;
    this.status = HTTP_STATUS.UNAUTHORIZED;
  }
}

class Forbidden { // 인가 실패 unauthorized (예: 접근 권한이 없을 때)
  constructor(message = Forbidden.name) {
    this.message = message;
    this.status = HTTP_STATUS.FORBIDDEN;
  }
}

class NotFound { // 데이터가 없는 경우
  constructor(message = NotFound.name) {
    this.message = message;
    this.status = HTTP_STATUS.NOT_FOUND;
  }
}

class Conflict { // 충돌이 발생했을 때 (예: 이메일 중복)
  constructor(message = Conflict.name) {
    this.message = message;
    this.status = HTTP_STATUS.CONFLICT;
  }
}

class InternalServerError { // 예상치 못한 에러가 발생했을 때
  constructor(message = InternalServerError.name) {
    this.message = message;
    this.status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  }
}

export const HttpError = {
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  Conflict,
  InternalServerError,
};
