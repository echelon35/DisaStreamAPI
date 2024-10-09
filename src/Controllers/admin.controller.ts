import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../Common/Decorators/role.decorator';
import { Role } from '../Common/Enumerators/role.enum';
import { RolesGuard } from 'src/Guards/role.guard';

@Controller('admin')
export class AdminController {
  constructor() {}

  @Get()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async isAdmin(): Promise<boolean> {
    return true;
  }
}
