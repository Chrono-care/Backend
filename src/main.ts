import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
    credentials: true,
    allowedHeaders: '*',
  });
  await app.listen(PORT);
  Logger.verbose(`App listenning on port ${PORT}.`);
}
bootstrap();
