import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertController } from 'src/Controllers/alert.controller';
import { ReportsController } from 'src/Controllers/reports.controller';
import { Alea } from 'src/Domain/alea.model';
import { Alert } from 'src/Domain/alert.model';
import { Category } from 'src/Domain/category.model';
import { ReportType } from 'src/Domain/reportType.model';
import { User } from 'src/Domain/user.model';
import { AlertService } from 'src/Services/alert.service';
import { ReportService } from 'src/Services/report.service';
import { Repository } from 'typeorm';

@Module({
  providers: [
    AlertService,
    Repository<Alert>,
    Repository<ReportType>,
    ReportService,
  ],
  imports: [
    TypeOrmModule.forFeature([Alert, ReportType, Alea, User, Category]),
  ],
  controllers: [AlertController, ReportsController],
})
export class AlertModule {}
