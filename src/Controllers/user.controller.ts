import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Request,
  Response,
} from '@nestjs/common';
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

  @Get('user/summary')
  async getAvatar(@Request() req, @Response() res): Promise<string> {
    const userId = req.user?.user?.id;
    try {
      const path = await this.userService.getSummaryInfos(userId);
      return res.status(HttpStatus.OK).json(path);
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          "Une erreur est survenue lors de la récupération de l'avatar : " + e,
        );
    }
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
