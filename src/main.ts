import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    { cors: true },
  );
  const configService = app.get(ConfigService);
  await app.register(fastifyCookie, {
    secret: configService.get<string>('jwt-secret'),
  });
  app.setGlobalPrefix('api');
  await app.listen(
    configService.get<number>('port', { infer: true }),
    configService.get<string>('address', { infer: true }) as string,
  );
}
bootstrap();
