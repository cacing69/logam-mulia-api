import { codeMapping } from '../../utils/code-mapping';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UnprocessableEntityException extends HttpException {
  constructor(error?: any) {
    super(
      {
        code: codeMapping.VALIDATE_FAILED,
        message: `there is an empty field or invalid data`,
        data: null,
        meta: null,
        extra: error || null,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
