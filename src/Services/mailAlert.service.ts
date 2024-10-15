import { SESClient, VerifyEmailIdentityCommand } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailAlert } from 'src/Domain/mailAlert.model';
import { Repository } from 'typeorm';

@Injectable()
export class MailAlertService {
  constructor(
    @InjectRepository(MailAlert)
    private mailAlertRepository: Repository<MailAlert>,
  ) {}

  async CreateMailAlert(userId: number, mail: string) {
    const mailUser = {
      mail: mail,
      userId: userId,
    };
    const isExist = await this.mailAlertRepository.existsBy({ mail: mail });
    if (!isExist) {
      const createdMail = await this.mailAlertRepository.insert(mailUser);
      if (createdMail !== null) {
        await this.AddMailAlertToSES(mail);
      }

      return createdMail.raw.length > 0;
    } else {
      return false;
    }
  }

  async AddMailAlertToSES(emailAddress: string) {
    const sesClient = new SESClient({ region: process.env.AWS_REGION });

    try {
      const command = new VerifyEmailIdentityCommand({
        EmailAddress: emailAddress,
      });
      const response = await sesClient.send(command);
      console.log(`Vérification de l'email envoyée à : ${emailAddress}`);
      return response;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'adresse email : ",
        error,
      );
    }
  }
}