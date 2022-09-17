import { codeMapping } from '../../utils/code-mapping';
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class EmailPipe implements PipeTransform<number, number> {
  transform(value: number, metadata: ArgumentMetadata) {
    if (this.checkIfValidEmail(value)) {
      return value;
    }

    throw new HttpException(
      {
        statusCode: codeMapping.INVALID_UUID,
        message: 'bad request, invalid email',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  private checkIfValidEmail(str) {
    const regexExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    return regexExp.test(str);
  }
}
