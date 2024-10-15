import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
import { Alert } from 'src/Domain/alert.model';
import { Repository } from 'typeorm';

@Injectable()
export class AlertService {
  constructor(private alertRepository: Repository<Alert>) {}

  CreateAlert(alert: CreateAlertDto) {
    this.alertRepository.create(alert);
  }
}
