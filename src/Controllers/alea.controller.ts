import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/Common/Decorators/public.decorator';
import { Alea } from 'src/Domain/alea.model';
import { AleaService } from 'src/Services/alea.service';

@Controller('aleas')
export class AleaController {
  constructor(private readonly aleaService: AleaService) {}

  @Get('/')
  @Public()
  async findAll(): Promise<Alea[]> {
    return await this.aleaService.FindAllWithCategories();
  }
}
