import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
// import { DatabaseService } from 'src/database/database.service';

export function IsExist(
  property: object,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsExist', async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly manager: EntityManager) {}

  async validate(value: any, args: ValidationArguments) {
    if (value) {
      const [params] = args.constraints;

      const result = await this.manager.getRepository(params).findOne({
        where: {
          [args.property]: value,
        },
      });

      if (result) return true;
      return false;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    console.log(args);
    return args.value
      ? `${args.property}(${args.value || ''}) doesn't exist`
      : `${args.property} failed check is exist`;
  }
}
