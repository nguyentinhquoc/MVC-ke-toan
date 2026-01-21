import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { AuthExceptionFilter } from 'src/auth/auth.filter';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cookie parser để đọc cookie
  app.use(cookieParser());

  // Apply Auth Exception Filter globally
  app.useGlobalFilters(new AuthExceptionFilter());

  // Cấu hình Handlebars view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Cấu hình thư mục public cho static files (CSS, JS, images)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
