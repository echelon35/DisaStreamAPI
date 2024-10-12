import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/Common/Decorators/public.decorator';
import { ReportService } from 'src/Services/report.service';

@Controller('report')
export class ReportsController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/type')
  @Public()
  async getTypes() {
    return await this.reportService.FindTypes();
  }
}
