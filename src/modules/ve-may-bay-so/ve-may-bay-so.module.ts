import { Module } from '@nestjs/common';
import { VeMayBaySoService } from './ve-may-bay-so.service';
import { VeMayBaySoController } from './ve-may-bay-so.controller';

@Module({
  controllers: [VeMayBaySoController],
  providers: [VeMayBaySoService],
})
export class VeMayBaySoModule {}
