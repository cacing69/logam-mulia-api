import { codeMapping } from '../../utils/code-mapping';
import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistException extends HttpException {
  constructor(field: string) {
    super(
      {
        code: codeMapping.CONFLICT,
        message: `${field} already exist`.trim(),
        data: null,
        meta: null,
        extra: null,
      },
      HttpStatus.CONFLICT,
    );
  }
}
