import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateUser } from 'src/Domain/Interfaces/ICreateUser';
import { User } from 'src/Domain/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getAvatarPath(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return user?.avatar;
  }

  async findOne(mail: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { mail: `${mail}` },
    });
  }

  async findMe(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
      select: {
        mail: true,
        firstname: true,
        lastname: true,
        last_connexion: true,
      },
    });
  }

  async findOneByPk(id: number): Promise<User> {
    // if (scope != '') {
    //   return await this.userModel.scope(scope).findByPk(id, { raw: true });
    // } else {
    return await this.userRepository.findOneBy({ id: id });
    // }
  }

  async logout(user: User): Promise<boolean> {
    user.last_connexion = new Date();
    const updatedUser = await this.userRepository.update({ id: user.id }, user);
    return updatedUser.affected > 0;
  }

  async updateOrCreate(user: ICreateUser): Promise<User> {
    const created = await this.userRepository.upsert(user, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['mail'],
    });

    const userCreated = await this.userRepository.findOneBy({
      id: created.raw[0]?.id,
    });
    return userCreated;
  }
}
