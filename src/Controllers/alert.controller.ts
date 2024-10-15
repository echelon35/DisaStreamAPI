import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
import { AlertService } from 'src/Services/alert.service';
import { MailAlertService } from 'src/Services/mailAlert.service';

export class CreateMailAlertDto {
  mail: string;
}

@Controller('alert')
export class AlertController {
  constructor(
    private readonly alertService: AlertService,
    private readonly mailAlertService: MailAlertService,
  ) {}

  @Post('/create')
  async createAlert(alert: CreateAlertDto) {
    await this.alertService.CreateAlert(alert);
  }

  @Post('/mail/create')
  async createMailAlert(
    @Body() createMailAlertDto: CreateMailAlertDto,
    @Request() req,
    @Response() res,
  ) {
    const isAlertCreated = await this.mailAlertService.CreateMailAlert(
      req?.user?.user?.id,
      createMailAlertDto?.mail,
    );
    if (isAlertCreated) {
      res
        .status(HttpStatus.OK)
        .json(
          `Un mail vient de vous être envoyé par AWS à l'adresse ${createMailAlertDto?.mail}. Cliquez sur le lien pour vérifier l'email.`,
        );
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(`Une erreur est survenue à l'ajout de l'email.`);
    }
  }
}
