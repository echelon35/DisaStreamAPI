import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHistoryDto } from 'src/DTO/createHistory.dto';
import { GetHistoryBetweenDateDto } from 'src/DTO/getHistoryBetweenDate.dto';
import { AlertHistory } from 'src/Domain/alertHistory.model';
import { Repository } from 'typeorm';

@Injectable()
export class AlertHistoryService {
  constructor(
    @InjectRepository(AlertHistory)
    private readonly alertHistoryRepository: Repository<AlertHistory>,
  ) {}

  async lastWeek(userId: number) {
    const alertHistories = this.alertHistoryRepository.query(`
        SELECT sequential_dates.date AS periodItem,
        COUNT("td".*)::integer AS count
		    FROM (
          SELECT "historyAlerts"."createdAt" FROM "historyAlerts" 
          INNER JOIN "alerts" ON "alerts".id = "historyAlerts"."alertId" WHERE "alerts"."userId" = ${userId}) as td
		    RIGHT JOIN (SELECT CURRENT_DATE - sequential_dates.date AS date
        FROM generate_series(0, 7) AS sequential_dates(date)) sequential_dates
			  ON "td"."createdAt"::date = sequential_dates.date
			  GROUP BY sequential_dates.date ORDER BY sequential_dates.date DESC`);

    return alertHistories;
  }

  async findAllByUserId(userId: number) {
    const alertHistories = await this.alertHistoryRepository
      .createQueryBuilder('historic')
      .leftJoinAndSelect('historic.alert', 'alert')
      // .select(['alea.name', 'alea.id', 'alea.label', 'category.name'])
      .where('alert.userId = :userId', {
        userId: userId,
      })
      .execute();

    return alertHistories;
  }

  async create(record: CreateHistoryDto) {
    await this.alertHistoryRepository.save(record);
  }
}
