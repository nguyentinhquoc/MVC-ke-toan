import { Injectable } from '@nestjs/common';
import { CreateVeMayBaySoDto } from './dto/create-ve-may-bay-so.dto';
import { UpdateVeMayBaySoDto } from './dto/update-ve-may-bay-so.dto';

@Injectable()
export class VeMayBaySoService {
  create(createVeMayBaySoDto: CreateVeMayBaySoDto) {
    return 'This action adds a new veMayBaySo';
  }

  findAll() {
    return `This action returns all veMayBaySo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} veMayBaySo`;
  }

  update(id: number, updateVeMayBaySoDto: UpdateVeMayBaySoDto) {
    return `This action updates a #${id} veMayBaySo`;
  }

  remove(id: number) {
    return `This action removes a #${id} veMayBaySo`;
  }
}
