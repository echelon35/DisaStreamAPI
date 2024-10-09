import { SQS } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { AlerterService } from './alerter.service';
import { DisasterDataFromSQS, InsertType } from 'src/DTO/disasterDataFromSQS';
import { CloudWatchService } from './cloudwatch.service';
import { Flood } from 'src/Domain/flood.model';

@Injectable()
export class QueueListenerService {
  private sqs: SQS;

  constructor(
    private readonly alerterService: AlerterService,
    private readonly cloudWatchService: CloudWatchService,
  ) {
    this.sqs = new SQS({
      region: process.env.AWS_REGION, // Spécifie ta région AWS
    });
  }

  async pollMessagesFromSQS(): Promise<void> {
    const queueUrl = process.env.AWS_QUEUE;

    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10, // Nombre maximum de messages à traiter par lot
      WaitTimeSeconds: 20, // Long polling: attend jusqu'à 20 secondes avant de retourner une réponse si aucun message n'est disponible
    };

    try {
      while (true) {
        const result = await this.sqs.receiveMessage(params);

        if (result.Messages && result.Messages.length > 0) {
          for (const message of result.Messages) {
            // console.log(`Message reçu : ${message.Body}`);
            const currentDisasterData = JSON.parse(message.Body);

            await this.handleMessage(currentDisasterData);

            // Supprimer le message une fois traité
            await this.deleteMessageFromQueue(queueUrl, message.ReceiptHandle);
          }
        }
      }
    } catch (error) {
      this.cloudWatchService.logToCloudWatch(
        'SQS',
        'Erreur lors de la réception des messages de SQS : ' + error,
      );
    }
  }

  private async deleteMessageFromQueue(
    queueUrl: string,
    receiptHandle: string,
  ): Promise<void> {
    try {
      await this.sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });

      this.cloudWatchService.logToCloudWatch(
        'SQS',
        `Message supprimé : ${receiptHandle}`,
      );
    } catch (error) {
      this.cloudWatchService.logToCloudWatch(
        'SQS',
        `Erreur lors de la suppression du message : ${error}`,
      );
    }
  }

  async handleFlood(flood: Flood, type: InsertType) {
    if (type == InsertType.CREATION) {
      let alert = `Une nouvelle inondation a été detectée par l'observatoire ${flood.source?.name}. _
      L'épisode a commencé le ${flood.premier_releve}.\n`;
      alert +=
        flood.nb_ressenti > 0 ? `${flood.nb_ressenti} témoignages \n` : '';
      alert += `Plus d'informations sur ${flood.lien_source} \n`;
      await this.alerterService.sendRealTimeAlert(alert);
    } else {
      let alert = `Les données d'une inondation ont été mises à jour par l'observatoire ${flood.source?.name}. _
      L'épisode a commencé le ${flood.premier_releve}.\n`;
      alert +=
        flood.nb_ressenti > 0 ? `${flood.nb_ressenti} témoignages \n` : '';
      alert += `Plus d'informations sur ${flood.lien_source} \n`;
      await this.alerterService.sendRealTimeAlert(alert);
    }
  }

  async handleMessage(disasterData: DisasterDataFromSQS) {
    switch (disasterData?.disaster_type) {
      case 'flood':
        await this.handleFlood(
          disasterData?.disaster as Flood,
          disasterData?.type,
        );
    }
  }
}
