import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alea } from 'src/Domain/alea.model';
import { Repository } from 'typeorm';

@Injectable()
export class AleaService {
  constructor(
    @InjectRepository(Alea) private readonly aleaRepository: Repository<Alea>,
  ) {}

  async FindAllWithCategories() {
    const aleas = await this.aleaRepository
      .createQueryBuilder('alea')
      .leftJoinAndSelect('alea.category', 'category')
      .select(['alea.name', 'category.name'])
      .execute();

    return aleas;
  }
}
