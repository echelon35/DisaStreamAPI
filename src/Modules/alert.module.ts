import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from 'src/Controllers/alert.controller';
import { ReportsController } from 'src/Controllers/reports.controller';
import { Alea } from 'src/Domain/alea.model';
import { Alert } from 'src/Domain/alert.model';
import { Category } from 'src/Domain/category.model';
import { MailAlert } from 'src/Domain/mailAlert.model';
import { ReportType } from 'src/Domain/reportType.model';
import { User } from 'src/Domain/user.model';
import { AlertService } from 'src/Services/alert.service';
import { MailAlertService } from 'src/Services/mailAlert.service';
import { ReportService } from 'src/Services/report.service';
import { Repository } from 'typeorm';

@Module({
  providers: [
    AlertService,
    Repository<Alert>,
    Repository<MailAlert>,
    Repository<ReportType>,
    ReportService,
    MailAlertService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Alert,
      ReportType,
      Alea,
      User,
      Category,
      MailAlert,
    ]),
  ],
  controllers: [AlertController, ReportsController],
})
export class AlertModule {}
