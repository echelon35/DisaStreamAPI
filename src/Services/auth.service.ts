import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { UserDto } from '../DTO/user.dto';
import { IGoogleLogin } from '../Domain/Interfaces/IGoogleLogin.interface';
import { UserService } from './user.service';
import { DownloadService } from './download.service';
import { S3Service } from './s3.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private downloadService: DownloadService,
    private S3Service: S3Service,
  ) {}

  /**
   *
   * @param user
   * @returns
   */
  async login(user: UserDto): Promise<any> {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  /**
   * Test user mail / password to return user
   * @param mail user mail
   * @param pass user password
   * @returns user || null
   */
  async validateUser(mail: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(mail);
    if (user && compareSync(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Log out connected user
   * @param id userId
   * @returns boolean isLogOut
   */
  async logout(id: number): Promise<boolean> {
    const user = await this.userService.findOneByPk(id);
    return await this.userService.logout(user);
  }

  /**
   * Search for a user send by google and create it if not exists
   * @param googleLogin user mail
   * @returns token with user
   */
  async googleLogin(googleLogin: IGoogleLogin): Promise<any> {
    //First try to find him
    const user = await this.userService.updateOrCreate(googleLogin);

    //Save avatar if empty
    if (user.avatar === null && googleLogin.avatar !== undefined) {
      const imageBuffer = await this.downloadService.downloadImage(
        googleLogin.avatar,
      );

      const s3AvatarUrl = await this.S3Service.UploadToS3(
        imageBuffer,
        `google-avatar-${user.id}.jpg`,
      );

      user.avatar = s3AvatarUrl;

      await this.userService.updateOrCreate(googleLogin);
    }

    //Give token
    return {
      access_token: this.jwtService.sign({ user }),
    };
  }
}
