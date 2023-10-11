import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerService } from './config/swagger/swagger.service';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(bodyParser.json({limit: '100mb'}));  
  app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));

  
  app.enableCors();
  app.setGlobalPrefix('/v1');
  new SwaggerService().init(app);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
