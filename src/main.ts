import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string, 
      methodKey: string
    ) => methodKey 
  };

  const documentFactory = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory, {
    customSiteTitle: 'API',
    customfavIcon: 'https://img.icons8.com/?size=100&id=nyaTzeaU786Z&format=png&color=000000',
  });

  new FastifyAdapter({ logger: true });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(3000, '0.0.0.0');

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
