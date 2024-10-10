import { Controller, Post } from '@nestjs/common';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
import { AlertService } from 'src/Services/alert.service';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('/create')
  async createAlert(alert: CreateAlertDto) {
    await this.alertService.CreateAlert(alert);
  }
}
