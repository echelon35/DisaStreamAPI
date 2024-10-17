import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from 'src/Controllers/admin.controller';
import { UserController } from 'src/Controllers/user.controller';
import { User } from 'src/Domain/user.model';
import { UserService } from 'src/Services/user.service';
import { AlertModule } from './alert.module';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), AlertModule],
  controllers: [UserController, AdminController],
  exports: [UserService],
})
export class UserModule {}
