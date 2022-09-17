import { codeMapping } from '../../utils/code-mapping';
import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ERROR } from '../../utils/error-code';

export class BadRequestException extends HttpException {
  constructor(error?: any, extra?: string) {
    console.log(`error`, error);
    let httpCode = codeMapping.BAD_REQUEST;
    let messageConstruct;

    if (error instanceof QueryFailedError) {
      httpCode = codeMapping.BAD_REQUEST_DB_ERROR;
      if ((error as any).code == ERROR.POSTGRES.UNIQUE_VALIDATION) {
        httpCode = codeMapping.BAD_REQUEST_DB_DUPLICATE;
        messageConstruct = 'duplicate key value violates unique constraint';
      }
      extra = (error as any).detail;
    }

    if (typeof error == 'string') messageConstruct = error;

    super(
      {
        code: httpCode,
        message: messageConstruct || `bad request`,
        data: null,
        meta: null,
        extra: extra ? [extra] : null,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
