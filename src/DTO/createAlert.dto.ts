import { Geometry } from 'geojson';
import { Alea } from 'src/Domain/alea.model';
import { MailAlert } from 'src/Domain/mailAlert.model';

export class CreateAlertDto {
  areas: Geometry;
  name: string;
  aleas: Alea[];
  mailAlerts: MailAlert[];
}
