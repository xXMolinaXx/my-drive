import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('backend');
  app.enableCors({ credentials: true });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const configService = app.get(ConfigService);
  const port = configService.get('puerto');
  const config = new DocumentBuilder().setTitle('Toma de huella LCM').setDescription('').setVersion('1.0').addTag('LCM').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('lcm-api', app, document);
  await app.listen(process.env.PORT || port);
  logger.log(`proyect running: ${await app.getUrl()}`);
}
bootstrap();
