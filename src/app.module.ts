import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VeMayBaySoModule } from 'src/modules/ve-may-bay-so/ve-may-bay-so.module';

@Module({
  imports: [VeMayBaySoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
