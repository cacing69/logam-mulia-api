import { codeMapping } from '../../utils/code-mapping';
import { HttpException, HttpStatus } from '@nestjs/common';

export class UnAuthorizedException extends HttpException {
  constructor() {
    super(
      {
        code: codeMapping.UNAUTHORIZED,
        message: 'unauthorized',
        data: null,
        meta: null,
        extra: null,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
