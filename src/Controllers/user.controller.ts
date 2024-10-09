import { Controller, Get, NotFoundException, Request } from '@nestjs/common';
import { UserDto } from '../DTO/user.dto';
import { UserService } from '../Services/user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  async findAll(): Promise<UserDto[]> {
    const users = await this.userService.findAll();
    return users;
  }

  @Get('profile')
  async findMe(@Request() req): Promise<UserDto> {
    if (req.user != null) {
      const me = await this.userService.findMe(req?.user?.id);
      return me;
    } else {
      throw new NotFoundException();
    }
  }
}
