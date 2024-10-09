import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlerterService } from './Services/alerter.service';
import { QueueListenerService } from './Services/queue_listener.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AlerterService, QueueListenerService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly sqsListenerService: QueueListenerService) {}

  onModuleInit() {
    // Listen to my SQS queue for real-time notifications
    this.sqsListenerService.pollMessagesFromSQS();
  }
}
