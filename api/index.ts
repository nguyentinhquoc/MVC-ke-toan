import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { join } from 'path';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

export let app: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
  const nestApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  // Cấu hình Handlebars view engine
  nestApp.setBaseViewsDir(join(__dirname, '..', 'views'));
  nestApp.setViewEngine('hbs');

  // Cấu hình thư mục public cho static files
  nestApp.useStaticAssets(join(__dirname, '..', 'public'));

  await nestApp.init();
  return nestApp;
}

createApp().then((nestApp) => {
  app = nestApp;
});

export default server;
