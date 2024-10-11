import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AleaController } from 'src/Controllers/alea.controller';
import { Alea } from 'src/Domain/alea.model';
import { Category } from 'src/Domain/category.model';
import { AleaService } from 'src/Services/alea.service';

@Module({
  providers: [AleaService],
  imports: [TypeOrmModule.forFeature([Alea, Category])],
  controllers: [AleaController],
})
export class AleaModule {}
