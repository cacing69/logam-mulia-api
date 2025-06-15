import { PostStatusInterceptor } from './core/interceptors/post-status.interceptor';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './core/filters/error.filter';
import { CustomValidationPipe } from './core/pipes/custom-validation.pipe';
import { useContainer } from 'class-validator';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: false,
      validationError: { target: true },
      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: true,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new PostStatusInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ErrorFilter(httpAdapter));

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
