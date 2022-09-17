import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsUnique(
  property: object,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsUniqueConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly manager: EntityManager) {}

  async validate(value: any, args: ValidationArguments) {
    if (value) {
      const [params] = args.constraints;

      const result = await this.manager.getRepository(params).findOne({
        where: {
          [args.property]: value,
        },
      });

      console.log(`result`, result);

      if (result) return false;
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    console.log(args);
    return args.value
      ? `${args.property}(${args.value || ''}) already exist`
      : `${args.property} failed unique check`;
  }
}
