import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from 'src/Controllers/alert.controller';
import { AlertHistoryController } from 'src/Controllers/alertHistory.controller';
import { CityController } from 'src/Controllers/city.controller';
import { ReportsController } from 'src/Controllers/reports.controller';
import { Alea } from 'src/Domain/alea.model';
import { Alert } from 'src/Domain/alert.model';
import { AlertHistory } from 'src/Domain/alertHistory.model';
import { Category } from 'src/Domain/category.model';
import { City } from 'src/Domain/city.model';
import { MailAlert } from 'src/Domain/mailAlert.model';
import { ReportType } from 'src/Domain/reportType.model';
import { User } from 'src/Domain/user.model';
import { AlertService } from 'src/Services/alert.service';
import { AlertHistoryService } from 'src/Services/alertHistory.service';
import { AlerterService } from 'src/Services/alerter.service';
import { CityService } from 'src/Services/city.service';
import { CloudWatchService } from 'src/Services/cloudwatch.service';
import { EmailerService } from 'src/Services/emailer.service';
import { MailAlertService } from 'src/Services/mailAlert.service';
import { QueueListenerService } from 'src/Services/queue_listener.service';
import { ReportService } from 'src/Services/report.service';
import { Repository } from 'typeorm';

@Module({
  providers: [
    CloudWatchService,
    EmailerService,
    Repository<Alert>,
    AlertService,
    AlertHistoryService,
    AlerterService,
    QueueListenerService,
    Repository<MailAlert>,
    Repository<ReportType>,
    ReportService,
    MailAlertService,
    CityService,
    Repository<City>,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Alert,
      ReportType,
      Alea,
      User,
      Category,
      MailAlert,
      AlertHistory,
    ]),
    TypeOrmModule.forFeature([City], 'DisasterDb'),
  ],
  controllers: [
    AlertController,
    ReportsController,
    AlertHistoryController,
    CityController,
  ],
  exports: [MailAlertService],
})
export class AlertModule implements OnModuleInit {
  constructor(private readonly sqsListenerService: QueueListenerService) {}
  onModuleInit() {
    // Listen to my SQS queue for real-time notifications
    this.sqsListenerService.pollMessagesFromSQS();
  }
}
