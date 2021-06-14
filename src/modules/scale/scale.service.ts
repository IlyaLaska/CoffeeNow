import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Scale } from './entities/scale.entity';

@Injectable()
export class ScaleService {
  constructor(
    @InjectRepository(Scale)
    private readonly scaleRepository: Repository<Scale>,
  ) {}

  async getAll(): Promise<Scale[]> {
    return await this.scaleRepository.find();
  }

  async getScales(): Promise<number[]> {
    return (await this.getAll()).map((scale) => scale.scale);
  }

  async add(scale: number): Promise<Scale> {
    try {
      return await this.scaleRepository.save({ scale });
    } catch (e) {
      if (e.message.includes('violates unique constraint')) {
        throw new ConflictException(`Provided scale (${scale}) already exists in the database`);
      } else {
        throw e;
      }
    }
  }

  async remove(scale: number): Promise<number | null | undefined> {
    const res = await this.scaleRepository.delete(scale);
    return res.affected;
  }
}
