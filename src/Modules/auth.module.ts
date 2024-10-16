import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from '../Strategy/google.strategy';
import { AuthService } from '../Services/auth.service';
import { AuthController } from '../Controllers/auth.controller';
import { LocalStrategy } from '../Strategy/local.strategy';
import { JwtStrategy } from '../Strategy/jwt.strategy';
import { UserModule } from './user.module';
import { DownloadService } from 'src/Services/download.service';
import { S3Service } from 'src/Services/s3.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.DISASTREAM_SECRET,
      signOptions: { expiresIn: 604800 },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    DownloadService,
    S3Service,
  ],
})
export class AuthModule {}
