import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { GetHistoryBetweenDateDto } from 'src/DTO/getHistoryBetweenDate.dto';
import { AlertHistoryService } from 'src/Services/alertHistory.service';

export class CreateMailAlertDto {
  mail: string;
}

@Controller('history')
export class AlertHistoryController {
  constructor(private readonly alertHistoryService: AlertHistoryService) {}

  @Get('')
  async getUserAlerts(@Request() req) {
    const userId = req?.user?.user?.id;
    return await this.alertHistoryService.findAllByUserId(userId);
  }

  @Get('/last-week')
  async lastWeek(@Request() req) {
    const userId = req?.user?.user?.id;
    return await this.alertHistoryService.lastWeek(userId);
  }
}
