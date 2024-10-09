import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlerterService } from './Services/alerter.service';
import { QueueListenerService } from './Services/queue_listener.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Domain/user.model';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';
import { AuthModule } from './Modules/auth.module';
import { UserModule } from './Modules/user.module';
import { CloudWatchService } from './Services/cloudwatch.service';

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
      entities: [User],
      synchronize: true,
      schema: 'public',
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AlerterService,
    CloudWatchService,
    QueueListenerService, //Here I make all my routes controlled by the authguard (token is required)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly sqsListenerService: QueueListenerService) {}

  onModuleInit() {
    // Listen to my SQS queue for real-time notifications
    // this.sqsListenerService.pollMessagesFromSQS();
  }
}
