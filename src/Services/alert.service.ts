import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
import { Alert } from 'src/Domain/alert.model';
import { MailAlert } from 'src/Domain/mailAlert.model';
import { User } from 'src/Domain/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AlertService {
  constructor(
    private alertRepository: Repository<Alert>,
    private mailAlertRepository: Repository<MailAlert>,
  ) {}

  CreateAlert(alert: CreateAlertDto) {
    this.alertRepository.create(alert);
  }

  CreateMailAlert(userId: number, mail: string) {
    const mailUser = {
      mail: mail,
      userId: userId,
    };
    this.mailAlertRepository.create(mailUser);
  }
}
