import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
import { DisasterDataFromSQS } from 'src/DTO/disasterDataFromSQS';
import { Alert } from 'src/Domain/alert.model';
import { Repository } from 'typeorm';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert) private alertRepository: Repository<Alert>,
  ) {}

  async CreateAlert(alert: CreateAlertDto) {
    await this.alertRepository.save(alert);
  }

  async deleteAlert(userId: number, deleteId: number): Promise<boolean> {
    const result = await this.alertRepository.delete({
      id: deleteId,
      userId: userId,
    });

    return result.affected > 0;
  }

  async getUserAlerts(userId: number) {
    const alerts = await this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.aleas', 'alea')
      .where({ userId: userId })
      .getMany();

    return alerts;
  }

  async findUserToAlert(disasterData: DisasterDataFromSQS) {
    const alerts = await this.alertRepository
      .createQueryBuilder('alert')
      .leftJoinAndSelect('alert.aleas', 'aleas')
      .leftJoinAndSelect('alert.mailAlerts', 'mailAlerts')
      .where(
        'ST_Contains(alert.areas,ST_GeomFromGeoJSON(:point)) AND :type IN (aleas.name)',
        {
          point: disasterData.disaster.point,
          type: disasterData.disaster_type,
        },
      )
      .getMany();

    return alerts;
  }
}
