import { Injectable } from '@nestjs/common';
import { EmailerService } from './emailer.service';
import { DisasterDataFromSQS } from 'src/DTO/disasterDataFromSQS';
import { readFileSync } from 'fs';
import * as mustache from 'mustache';
import * as path from 'path';

/**
 * Service to send alerts to users
 */
@Injectable()
export class AlerterService {
  constructor(private emailerService: EmailerService) {}

  async sendRealTimeAlert(disasterData: DisasterDataFromSQS) {
    const templatePath = '../MailTemplates/alert.template.html';
    let templateData;
    let subjectMail;

    switch (disasterData.disaster_type) {
      case 'flood':
        templateData = {
          background:
            'https://disastream.s3.eu-west-3.amazonaws.com/background/inondation.jpg',
          title: 'INONDATION DETECTEE',
          subtitle: "L'une de vos alertes a detecté une inondation",
          linkSource: disasterData?.disaster?.lien_source,
          disasterDate: `L'inondation a debuté à ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
          disasterLocation: `L'inondation est localisée à 30km de Bordeaux`,
          disasterSource: `L'inondation a été detectée par l'observatoire ${disasterData?.disaster?.source?.name}.`,
          disasterImpact: `L'impact n'est pas connu`,
        };
        subjectMail = 'Kevin, votre alerte a detecté une nouvelle inondation !';
        break;
      case 'earthquake':
        templateData = {
          background:
            'https://disastream.s3.eu-west-3.amazonaws.com/background/seisme.jpg',
          title: 'SEISME DETECTE',
          subtitle: "L'une de vos alertes a detecté un séisme",
          linkSource: disasterData?.disaster?.lien_source,
          disasterDate: `Le séisme a eu lieu à ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
          disasterLocation: `L'épicentre est localisé à 30km de Bordeaux`,
          disasterSource: `Le séisme a été detecté par l'observatoire ${disasterData?.disaster?.source?.name}.`,
          disasterImpact: `L'impact n'est pas connu`,
        };
        subjectMail = 'Kevin, votre alerte a detecté un nouveeau séisme !';
        break;
      case 'hurricane':
        templateData = {
          background:
            'https://disastream.s3.eu-west-3.amazonaws.com/background/cyclone.jpg',
          title: 'CYCLONE DETECTE',
          subtitle: "L'une de vos alertes a detecté un cyclone",
          linkSource: disasterData?.disaster?.lien_source,
          disasterDate: `Le cyclone existe depuis ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
          disasterLocation: `Le cyclone est localisé au-dessus de l'océan Pacifique`,
          disasterSource: `Le cyclone a été detecté par l'observatoire ${disasterData?.disaster?.source?.name}.`,
          disasterImpact: `L'impact n'est pas connu`,
        };
        subjectMail = 'Kevin, votre alerte a detecté un nouveau cyclone !';
        break;
      case 'hurricane':
        templateData = {
          background:
            'https://disastream.s3.eu-west-3.amazonaws.com/background/cyclone.jpg',
          title: 'ERUPTION VOLCANIQUE DETECTEE',
          subtitle: "L'une de vos alertes a detecté une éruption volcanique",
          linkSource: disasterData?.disaster?.lien_source,
          disasterDate: `L'éruption a commencé à ${disasterData?.disaster?.premier_releve} selon la source mais fut enregistrée à ${disasterData?.disaster?.createdAt}.`,
          disasterLocation: `Le volcan Pinatubo est entré en éruption`,
          disasterSource: `L'éruption a été detectée par l'observatoire ${disasterData?.disaster?.source?.name}.`,
          disasterImpact: `L'impact n'est pas connu`,
        };
        subjectMail =
          'Kevin, votre alerte a detecté une nouvelle éruption volcanique !';
        break;
      default:
        throw new Error('Unknown email type');
    }

    const template = readFileSync(
      path.resolve(__dirname, templatePath),
      'utf8',
    );
    const htmlContent = mustache.render(template, templateData);

    await this.emailerService.sendEmail(
      'kbrun.pro@gmail.com',
      subjectMail,
      htmlContent,
    );
  }
}
