import {
  Body,
  Controller,
  Get,
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
  async createAlert(
    @Body() alertDto: CreateAlertDto,
    @Request() req,
    @Response() res,
  ) {
    const userId = req?.user?.user?.id;

    const alert = {
      name: alertDto.name,
      areas: alertDto.areas,
      aleas: alertDto.aleas,
      userId: userId,
    };
    await this.alertService.CreateAlert(alert);
    res
      .status(HttpStatus.OK)
      .json(`Votre nouvelle alerte ${alertDto.name} a bien été créée.`);
  }

  @Get('')
  async getUserAlerts(@Request() req) {
    const userId = req?.user?.user?.id;
    return await this.alertService.getUserAlerts(userId);
  }

  @Post('/mail/create')
  async createMailAlert(
    @Body() createMailAlertDto: CreateMailAlertDto,
    @Request() req,
    @Response() res,
  ) {
    try {
      await this.mailAlertService.CreateMailAlert(
        req?.user?.user?.id,
        createMailAlertDto?.mail,
      );
      res
        .status(HttpStatus.OK)
        .json(
          `Un mail vient de vous être envoyé par AWS à l'adresse ${createMailAlertDto?.mail}. Cliquez sur le lien pour vérifier l'email.`,
        );
    } catch (e: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: `Une erreur est survenue lors de l'ajout de l'email : ${e}.`,
      });
    }
  }

  @Get('/mails')
  async getMailAlerts(@Request() req, @Response() res) {
    const userId = req?.user?.user?.id;
    const mailAlerts =
      await this.mailAlertService.getMailAdressesOfUser(userId);
    res.status(HttpStatus.OK).json(mailAlerts);
  }
}
