import { Geometry } from 'geojson';
import { User } from 'src/Domain/user.model';

export class CreateAlertDto {
  areas: Geometry[];
  name: string;
  user: User;
}
