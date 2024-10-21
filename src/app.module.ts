import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Domain/user.model';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';
import { AuthModule } from './Modules/auth.module';
import { UserModule } from './Modules/user.module';
import { CloudWatchService } from './Services/cloudwatch.service';
import { Alea } from './Domain/alea.model';
import { Category } from './Domain/category.model';
import { AleaModule } from './Modules/alea.module';
import { AlertModule } from './Modules/alert.module';
import { Alert } from './Domain/alert.model';
import { ReportType } from './Domain/reportType.model';
import { MailAlert } from './Domain/mailAlert.model';
import { AlertHistory } from './Domain/alertHistory.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DISASTREAM_DB_HOST,
      port: parseInt(process.env.DISASTREAM_DB_PORT),
      username: process.env.DISASTREAM_DB_USER,
      password: process.env.DISASTREAM_DB_PASSWORD,
      database: process.env.DISASTREAM_DB_NAME,
      entities: [
        User,
        Alea,
        Category,
        Alert,
        ReportType,
        MailAlert,
        AlertHistory,
      ],
      synchronize: true,
      schema: 'public',
      logging: 'all',
    }),
    UserModule,
    AuthModule,
    AleaModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CloudWatchService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
