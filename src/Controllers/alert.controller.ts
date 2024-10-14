import { Controller, Post, Request } from '@nestjs/common';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
import { AlertService } from 'src/Services/alert.service';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post('/create')
  async createAlert(alert: CreateAlertDto) {
    await this.alertService.CreateAlert(alert);
  }

  @Post('/mail/create')
  async createMailAlert(@Request() req) {
    const mailAlert = await this.alertService.CreateMailAlert(
      req?.user?.id,
      req?.mail,
    );
    return mailAlert;
  }
}
