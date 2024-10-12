import { User } from 'src/Domain/user.model';
import { Geometry } from 'typeorm';

export class CreateAlertDto {
  areas: Geometry;
  name: string;
  user: User;
}
