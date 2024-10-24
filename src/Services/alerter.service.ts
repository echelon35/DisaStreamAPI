import { Injectable } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { DisasterDataFromSQS, InsertType } from 'src/DTO/disasterDataFromSQS';
import { readFileSync } from 'fs';
import * as mustache from 'mustache';
import * as path from 'path';
import { AlertService } from './alert.service';
import { Alert } from 'src/Domain/alert.model';
import { AlertHistoryService } from './alertHistory.service';
import { CreateHistoryDto } from 'src/DTO/createHistory.dto';
import { CityService } from './city.service';

/**
 * Service to send alerts to users
 */
@Injectable()
export class AlerterService {
  constructor(
    private emailerService: EmailerService,
    private alertService: AlertService,
    private alertHistoryService: AlertHistoryService,
    private cityService: CityService,
  ) {}

  async sendRealTimeAlert(disasterData: DisasterDataFromSQS) {
    const templatePath = '../MailTemplates/alert.template.html';
    let templateData;
    let subjectMail;

    const alertsToSend = await this.alertService.findUserToAlert(disasterData);

    const nearestCity = await this.cityService.findNearestTown(
      disasterData.disaster.point,
    );
    console.log('On a trouvé la ville la plus proche : ');
    console.log(nearestCity.ville);
    console.log(nearestCity.distance);

    const template = readFileSync(
      path.resolve(__dirname, templatePath),
      'utf8',
    );

    const titleTypeUpdate =
      disasterData.type == InsertType.CREATION ? 'a detecté' : 'a mis à jour';

    alertsToSend.forEach(async (alert: Alert) => {
      const myAlerts = 'https://disastream.com/dashboard/alerts/manage';
      const modifyAlerts =
        'https://disastream.com/dashboard/alerts/' + alert.id;

      switch (disasterData.disaster_type) {
        case 'flood':
          templateData = {
            background:
              'https://disastream.s3.eu-west-3.amazonaws.com/background/flood.jpg',
            title: 'INONDATION DETECTEE',
            subtitle: `Votre alerte ${alert.name} ${titleTypeUpdate} une inondation`,
            linkSource: disasterData?.disaster?.lien_source,
            disasterDate: `L'inondation a debuté à ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
            disasterLocation: `L'inondation est localisée à ${Math.ceil(nearestCity.distance)}km de ${nearestCity.ville} (${nearestCity.pays})`,
            disasterSource: `L'inondation a été detectée par l'observatoire ${disasterData?.disaster?.source?.name}.`,
            disasterImpact: `L'impact n'est pas connu`,
            myAlerts: `${myAlerts}`,
            modifyAlerts: `${myAlerts}`,
          };
          subjectMail = `Votre alerte ${titleTypeUpdate} une inondation !`;
          break;
        case 'earthquake':
          templateData = {
            background:
              'https://disastream.s3.eu-west-3.amazonaws.com/background/earthquake.jpg',
            title: 'SEISME DETECTE',
            subtitle: `Votre alerte ${alert.name} ${titleTypeUpdate} un séisme`,
            linkSource: disasterData?.disaster?.lien_source,
            disasterDate: `Le séisme a eu lieu à ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
            disasterLocation: `L'épicentre est localisé à ${Math.ceil(nearestCity.distance)}km de ${nearestCity.ville} (${nearestCity.pays})`,
            disasterSource: `Le séisme a été detecté par l'observatoire ${disasterData?.disaster?.source?.name}.`,
            disasterImpact: `L'impact n'est pas connu`,
            myAlerts: `${myAlerts}`,
            modifyAlerts: `${myAlerts}`,
          };
          subjectMail = `Votre alerte ${titleTypeUpdate} un séisme !`;
          break;
        case 'hurricane':
          templateData = {
            background:
              'https://disastream.s3.eu-west-3.amazonaws.com/background/hurricane.jpg',
            title: 'CYCLONE DETECTE',
            subtitle: `Votre alerte ${alert.name} ${titleTypeUpdate} un cyclone`,
            linkSource: disasterData?.disaster?.lien_source,
            disasterDate: `Le cyclone existe depuis ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
            disasterLocation: `Le cyclone est actuellement situé à ${Math.ceil(nearestCity.distance)}km de ${nearestCity.ville} (${nearestCity.pays})`,
            disasterSource: `Le cyclone a été detecté par l'observatoire ${disasterData?.disaster?.source?.name}.`,
            disasterImpact: `L'impact n'est pas connu`,
            myAlerts: `${myAlerts}`,
            modifyAlerts: `${myAlerts}`,
          };
          subjectMail = `Votre alerte ${titleTypeUpdate} un cyclone !`;
          break;
        case 'eruption':
          templateData = {
            background:
              'https://disastream.s3.eu-west-3.amazonaws.com/background/eruption.jpg',
            title: 'ERUPTION VOLCANIQUE DETECTEE',
            subtitle: `Votre alerte ${alert.name} ${titleTypeUpdate} une éruption volcanique`,
            linkSource: disasterData?.disaster?.lien_source,
            disasterDate: `L'éruption a commencé à ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
            disasterLocation: `L'éruption est située à ${Math.ceil(nearestCity.distance)}km de ${nearestCity.ville} (${nearestCity.pays})`,
            disasterSource: `L'éruption a été detectée par l'observatoire ${disasterData?.disaster?.source?.name}.`,
            disasterImpact: `L'impact n'est pas connu`,
            myAlerts: `${myAlerts}`,
            modifyAlerts: `${myAlerts}`,
          };
          subjectMail = `Votre alerte ${titleTypeUpdate} une éruption volcanique !`;
          break;
        default:
          throw new Error('Unknown email type');
      }

      const htmlContent = mustache.render(template, templateData);

      alert.mailAlerts.forEach(async (mailAlert) => {
        await this.emailerService.sendEmail(
          mailAlert.mail,
          subjectMail,
          htmlContent,
        );
      });

      console.log("Création d'un enregistrement en base pour l'alerte envoyée");

      const record: CreateHistoryDto = {
        alert: alert,
        notification: templateData,
        disasterDataFromSQS: disasterData,
      };
      await this.alertHistoryService.create(record);
    });
  }
}
