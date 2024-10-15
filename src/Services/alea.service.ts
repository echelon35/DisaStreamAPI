import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alea } from 'src/Domain/alea.model';
import { Repository } from 'typeorm';

@Injectable()
export class AleaService {
  constructor(
    @InjectRepository(Alea)
    private readonly aleaRepository: Repository<Alea>,
  ) {}

  async FindAllByCategories() {
    const aleas = await this.aleaRepository
      .createQueryBuilder('alea')
      .leftJoinAndSelect('alea.category', 'category')
      .select(['alea.name', 'alea.id', 'alea.label', 'category.name'])
      // .groupBy('category')
      .execute();

    return aleas;
  }
}
