import { PartialType } from '@nestjs/mapped-types';
import { CreateVeMayBaySoDto } from './create-ve-may-bay-so.dto';

export class UpdateVeMayBaySoDto extends PartialType(CreateVeMayBaySoDto) {}
