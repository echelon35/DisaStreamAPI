import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Response,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../Services/auth.service';
import { Public } from '../Common/Decorators/public.decorator';
import { GoogleAuthGuard } from '../Guards/google-auth.guard';
import { LocalAuthGuard } from '../Guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Request() req) {
    if (req?.user != null) {
      return this.authService.logout(req?.user?.id);
    } else {
      return false;
    }
  }

  // @HttpCode(HttpStatus.OK)
  // @Public()
  // @Post('signup')
  // signUp(@Body() signUpDto: SignupDto) {
  //   return this.authService.signUp(signUpDto);
  // }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const token = await this.authService.googleLogin(req.user);
    if (token) {
      return res.redirect(
        `${process.env.DISASTREAM_FRONT_BASE_URI}/dashboard?access_token=${token.access_token}`,
      );
    } else {
      throw new ForbiddenException();
    }
  }
}
