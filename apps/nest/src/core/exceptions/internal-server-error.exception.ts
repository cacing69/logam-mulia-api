import { codeMapping } from '../../utils/code-mapping';
import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
  constructor(error?: any) {
    const errorIgnoreMsg = ['error:'];
    let errorMessage = error?.toString()?.toLowerCase();
    const defaultErrorMessage = `something wrong, internal server error`;

    errorIgnoreMsg.forEach((e) => {
      errorMessage = errorMessage.replace(e, '');
    });

    errorMessage = errorMessage.trim();

    super(
      {
        code: codeMapping.INTERNAL_SERVER_ERROR,
        message: errorMessage || defaultErrorMessage,
        meta: null,
        data: null,
        extra: null,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
