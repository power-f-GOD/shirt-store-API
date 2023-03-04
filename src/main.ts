// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-expand').expand(require('dotenv').config());

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { static as __static } from 'express';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { PORT } from './constants';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Shirt Store')
    .setDescription('API for Shirt Store UI.')
    .setVersion('1.0')
    .addTag('shire-store')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({
    origin: /localhost/i,
    credentials: true
  });
  app.setGlobalPrefix('/api');
  app.use('/public', __static(join(__dirname, '..', 'public')));
  app.use(cookieParser());
  await app.listen(PORT, () =>
    setTimeout(
      () => console.log(`Server listening on PORT=${PORT}, BTW.`),
      1000
    )
  );
};

bootstrap();
