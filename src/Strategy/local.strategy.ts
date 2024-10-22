import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'mail' });
  }

  async validate(mail: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(mail, password);
    if (!user) {
      throw new UnauthorizedException(
        'Adresse mail ou mot de passe incorrect',
        {
          cause: new Error(),
          description: 'Adresse mail ou mot de passe incorrect',
        },
      );
    } else if (user?.provider == 'GOOGLE') {
      throw new UnauthorizedException(
        'Un compte Google existe à cette adresse, veuillez-vous connecter via le bouton Google',
      );
    }
    return user;
  }
}
