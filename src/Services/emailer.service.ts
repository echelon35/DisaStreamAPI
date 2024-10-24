import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import { SESTransport } from 'nodemailer-ses-transport';

/**
 * Service to send alerts to users
 */
@Injectable()
export class EmailerService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION,
      } as SESTransport.Options),
    });
  }

  async sendEmail(toEmail: string, subject: string, htmlContent: any) {
    const mailOptions = {
      from: 'disastream.noreply@gmail.com', // Email expéditeur
      to: toEmail, // Destinataire
      subject: subject, // Sujet du mail
      html: htmlContent, // Contenu HTML du mail
    };

    try {
      await this.transporter.sendMail(mailOptions);
      // console.log('Email envoyé avec succès');
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      throw new Error('Email not sent');
    }
  }
}
