import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CRM Tasks & Comments API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, doc);

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}
bootstrap();
