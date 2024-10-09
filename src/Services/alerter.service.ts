import { Injectable } from '@nestjs/common';
import { SNS } from 'aws-sdk';
import { CloudWatchService } from './cloudwatch.service';

/**
 * Service to send alerts to users
 */
@Injectable()
export class AlerterService {
  sns = new SNS();
  topicArn = process.env.AWS_TOPIC; // Topic ARN

  constructor(private cloudWatchService: CloudWatchService) {}

  async sendRealTimeAlert(message: string) {
    const params = {
      Subject: 'Nouvelle catastrophe detectée dans votre zone',
      Message: message,
      TopicArn: this.topicArn,
    };

    try {
      await this.sns.publish(params).promise();
      this.cloudWatchService.logToCloudWatch(
        'SQS',
        `Nouvelle alerte envoyée : ${message}`,
      );
    } catch (error) {
      this.cloudWatchService.logToCloudWatch(
        'SQS',
        `Erreur lors de l'envoi d'une alerte : ${error}`,
      );
    }
  }
}
