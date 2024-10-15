import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
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

  async getUserAlerts(userId: number) {
    return await this.alertRepository.findBy({ userId: userId });
  }
}
