import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { Public } from 'src/Common/Decorators/public.decorator';
import { CreateAlertDto } from 'src/DTO/createAlert.dto';
import { DisasterDataFromSQS } from 'src/DTO/disasterDataFromSQS';
import { AlertService } from 'src/Services/alert.service';
import { AlerterService } from 'src/Services/alerter.service';
import { MailAlertService } from 'src/Services/mailAlert.service';

export class CreateMailAlertDto {
  mail: string;
}

@Controller('alert')
export class AlertController {
  constructor(
    private readonly alertService: AlertService,
    private readonly alerterService: AlerterService,
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
      mailAlerts: alertDto.mailAlerts,
      userId: userId,
    };

    // console.log(alert);
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

  @Public()
  @Post('/testalert')
  async TestAlerts(@Body() body: DisasterDataFromSQS) {
    // console.log(body);
    return await this.alerterService.sendRealTimeAlert(body);
  }

  @Delete('/delete/:id')
  async deleteAlert(@Param('id') id: number, @Request() req, @Response() res) {
    const userId = req?.user?.user?.id;
    const deleteId = id;
    const deletion = await this.alertService.deleteAlert(userId, deleteId);
    if (deletion) {
      res.status(HttpStatus.OK).json("L'alerte a bien été supprimée");
    } else {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json("L'alerte n'a pas été supprimée");
    }
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
