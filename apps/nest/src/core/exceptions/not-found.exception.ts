import { codeMapping } from '../../utils/code-mapping';
import { HttpException, HttpStatus } from '@nestjs/common';

export class RecordNotFoundException extends HttpException {
  constructor(message?: string) {
    super(
      {
        code: codeMapping.RECORD_NOT_FOUND,
        message: message || 'record not found',
        data: null,
        meta: null,
        extra: null,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class RecordNotFoundToUpdateException extends HttpException {
  constructor() {
    super(
      {
        code: codeMapping.UPDATE_NOT_FOUND,
        message: 'update failed, data not found',
        data: null,
        meta: null,
        extra: null,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class RecordNotFoundToDeleteException extends HttpException {
  constructor() {
    super(
      {
        code: codeMapping.DELETE_NOT_FOUND,
        message: 'delete failed, data not found',
        data: null,
        meta: null,
        extra: null,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
