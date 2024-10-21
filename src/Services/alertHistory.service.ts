import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHistoryDto } from 'src/DTO/createHistory.dto';
import { AlertHistory } from 'src/Domain/alertHistory.model';
import { Repository } from 'typeorm';

@Injectable()
export class AlertHistoryService {
  constructor(
    @InjectRepository(AlertHistory)
    private readonly alertHistoryRepository: Repository<AlertHistory>,
  ) {}

  async FindAll() {
    const alertHistories = await this.alertHistoryRepository
      .createQueryBuilder('historic')
      .leftJoinAndSelect('historic.alert', 'alert')
      // .select(['alea.name', 'alea.id', 'alea.label', 'category.name'])
      // .groupBy('category')
      .execute();

    return alertHistories;
  }

  async create(record: CreateHistoryDto) {
    await this.alertHistoryRepository.save(record);
  }
}
